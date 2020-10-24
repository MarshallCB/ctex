// from https://github.com/lukeed/flattie
function iterate(val, callback=(()=>{}), sep='/', key='', out={}) {
  var k, pfx = key ? (key + sep) : key;
  if (val && val._isCtex){
    callback(key,val);
    for (k of val) {
      iterate(val[k], callback, sep, pfx+k, out);
    }
  }else if (Array.isArray(val)) {
    for (k=0; k < val.length; k++) {
      iterate(val[k], callback, sep, pfx+k, out);
    }
  } else if(val && typeof val == 'object') {
    for (k in val) {
      iterate(val[k], callback, sep, pfx+k, out);
    }
  } else {
    dset(out, key, val);
  }
  return out;
}

// from https://github.com/lukeed/dset/
function dset(obj,keys,val){
  keys=keys.split('/');
  var i=0, l=keys.length, t=obj, x;
  for (; i < l; ++i) {
    x = t[keys[i]];
    t = t[keys[i]] = (i === l - 1 ? val : (x != null ? x : (!!~keys[i+1].indexOf('.') || !(+keys[i+1] > -1)) ? {} : []));
  }
}

// from https://github.com/developit/dlv
function traverse(obj, key, p, undef) {
  key = key.split('/');
  let o = obj;
	for (p = 0; p < key.length; p++) {
		o = o ? o[key[p]] : undef;
	}
	return o;
}

function parseDefinition(d,x){
  let impn = [()=>{},[],[],[]];
  Object.getOwnPropertyNames(d)
  .forEach(p => {
    x=d[p];
    if(p !== 'init'){
      impn[typeof x === 'function' ? 1 : (x && x._isCtex) ? 3 : 2].push(p);
    } else {
      impn[0]=x;
    }
  });
  return impn
}

// TODO: try replacing Map() with {}
// TODO: generalize flattie to improve values() and set() for arrays and objects
// TODO: include flag for whether root subscription should trigger save (no if from internal node)

class Ctex{
  constructor(impn,definition,initial){
    // this.init = impn[0].bind(this)
    let def = function(key,value,custom=false){
      Object.defineProperty(this,key,custom?value:{value});
    }.bind(this);
    // marker
    def('_isCtex',true);
    // subscribers
    def('s',{});
    // succinct way to define generator function to iterate over properties and nodes
    // used by the iterate function in utils
    def(Symbol.iterator,{*a(){yield* impn[2];yield* impn[3];}}.a);
    
    // Set methods
    impn[1].map(k => {
      def(k,{
        set(x){ Promise.resolve(definition[k](x)); },
        get(){ return definition[k] },
        enumerable: true
      },true);
    });
    // Set properties
    impn[2].map(k => {
      let { get, set } = Object.getOwnPropertyDescriptor(definition,k);
      def('_$'+k,{writable:true},true);
      def(k,get ? {get} : {
        set(x){
          x = set ? set(x) : x;
          if(this['_$'+k] !== x){
            this['_$'+k] = x;
            let s = this.s;
            if(s[k]){
              for(let f of s[k])
                Promise.resolve(f(x));
            }
            if(s['']){
              let vals = iterate(this);
              for(let f of s[''])
                Promise.resolve(f(vals));
            }
          }
        },
        get(){
          return this['_$'+k]
        },
        enumerable: true
      },true);
      if(!get)
        this[k] = initial[k] || definition[k];
    });
    // set inner nodes
    impn[3].map(k => {
      def(k,{
        set(x={}){
          if(this[k] instanceof Ctex){
            this[k].set(x);
          } else {
            this[k] = definition[k](x);
          }
        },
        enumerable: true
      },true);
      this[k] = initial[k];
    });
    Object.seal(this);
    // call init function
    impn[0].bind(this)();
  }
  subscribe(k,fn,id=Symbol()){
    if(this[k] !== undefined){
      // if only function is passed, assume they're subscribing to root function
      if(!fn){
        fn = k;
        k = '';
      }
      fn=fn.bind(this);
      if(this[k] && this[k]._isCtex){
        // subscribe to context's root
        return this[k].subscribe(fn)
      }
      this.s[k] = this.s[k]||new Set();
      this.s[k].add(fn);
      return ()=>this.s[k].delete(fn)
    }
  }
  set(obj={}, recurseFlag=true){
    Object.assign(this,obj);
  }
  values(){
    return iterate(this)
  }
}

function Model(definition){
  let fn = (initial) => Context(definition,initial);
  fn._isCtex = true;
  return fn;
}

function Context(definition,initial={}){
  return new Ctex(parseDefinition(definition),definition,initial)
}

function Network(def){
  let root = Model(def)();
  
  function is(r){
    return traverse(root,r);
  }
  is.get = function(r){
    let ans = traverse(root,r);
    return (ans && ans._isCtex) ? ans.values() : ans;
  };
  is.post = function(r,data){
    return traverse(root,r)(data);
  };
  is.save = function(saveFn){
    let cb = (key,ctex) => ctex.subscribe((data) => saveFn(key,data));
    cb('index',root);
    iterate(root, cb);
    return is;
  };
  is.load = function(loadFn){
    let cb = (key,ctex)=>{
      Promise.resolve(loadFn(key))
        .then(v => root.set(v))
        .catch(err => console.log(err));
    };
    cb('index');
    iterate(root, cb);
    return is;
  };
  return is;
}

export { Model, Network };
