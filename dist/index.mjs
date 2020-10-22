function parseObject(d){
  let mpn = [[],[],[]];
  Object.getOwnPropertyNames(d)
  .forEach(p => {
    if(p !== 'init')
      mpn[typeof d[p] === 'function' ? 0 : (d[p] && d[p]._isCtex) ? 2 : 1].push(p);
  });
  return mpn
}

class Ctex{
  constructor(impn,definition,initial){
    // this.init = impn[0].bind(this)
    let def = function(key,value,custom=false){
      Object.defineProperty(this,key,custom?value:{value});
    }.bind(this);
    // init() function
    def('init',impn[0].bind(this));
    // root subscription key
    def('r',Symbol());
    // marker
    def('_isCtex',true);
    // subscribers
    def('s',{});
    // succinct way to define generator function to iterate over properties and nodes
    def(Symbol.iterator,{*a(){yield* impn[2];yield* impn[3];}}.a);
    
    let values = this.values.bind(this);
    // Set methods
    impn[1].forEach(k => {
      def(k,{
        set(x){ Promise.resolve(definition[k](x)); },
        get(){ return definition[k] },
        enumerable: true
      },true);
    });
    // Set properties
    impn[2].forEach(k => {
      let { get, set } = Object.getOwnPropertyDescriptor(definition,k);
      def('_$'+k,{writable:true},true);
      def(k,get ? {get} : {
        set(x){
          this[`_$${k}`] = set ? set(x) : x;
          if(this.s[k]){
            this.s[k].forEach(f => Promise.resolve(f(x)));
          }
          if(this.s[this.r]){
            this.s[this.r].forEach(f => Promise.resolve(f(values())));
          }
          // TODO: include flag for whether root subscription should trigger save (no if from internal node)
          // TODO: include values() flag for JSON-friendly, storage-friendly, or what
        },
        get(){
          return this[`_$${k}`]
        },
        enumerable: true
      },true);
      if(!get)
        this[k] = initial[k] || definition[k];
    });
    // set inner nodes
    impn[3].forEach(k => {
      this[k] = definition[k];
      this[k] instanceof Ctex ? this[k].set(initial[k] || {}) : this[k]=this[k](initial[k] || {});
    });
    Object.seal(this);
    this.init();
  }
  subscribe(k,fn){
    let id = Symbol();
    if(typeof k === 'function'){
      fn = k;
      k = this.r;
    }
    if(!this.s[k]){
      this.s[k] = new Map();
    }
    this.s[k].set(id, fn);
    return ()=>this.s[k].delete(id);
  }
  set(obj){
    for(let [k,v] of Object.entries(obj))
      if(this[k] !== undefined)
      (this[k] && this[k]._isCtex) ? this[k].set(v) : this[k]=v;
  }
  values(){
    let ans = {};
    for(var k of this)
      ans[k] = (this[k] && this[k]._isCtex) ? this[k].values() : this[k];
    return ans
  }
}

function Context(definition){
  let { init, ...rest } = definition;
  let mpn = parseObject(rest);
  let fn = (initial={}) => new Ctex([init || (()=>{}),...mpn],definition,initial);
  fn._isCtex = true;
  return fn;
}

// from https://github.com/lukeed/flattie
function iterate(val, callback, sep='/', key='') {
	var k, pfx = key ? (key + sep) : key;
  if(val!=null){
    if (val._isCtex){
      callback(key,val);
      for (k of val) {
        iterate(val[k], callback, sep, pfx+k);
      }
    }else if (Array.isArray(val)) {
      for (k=0; k < val.length; k++) {
        iterate(val[k], callback, sep, pfx+k);
      }
    } else if(typeof val == 'object') {
      for (k in val) {
        iterate(val[k], callback, sep, pfx+k);
      }
    }
  }
}

function traverse(root,route){
  let segments = route.split('/').filter(s=>s.length);
  let a = root;
  // remember last key
  let last = segments.pop();
  // traverse to final parent
  for(let s of segments){
    a = a[s];
  }
  // return parent node & final key
  return [a, last];
}



function Network(def){
  let root = Context(def)();
  
  function is(r){
    let [parent, key] = traverse(root,r);
    return parent[key];
  }
  is.get = function(r){
    let [parent, key] = traverse(root,r);
    let ans = parent[key];
    return (ans && ans._isCtex) ? ans.values() : ans;
  };
  is.post = function(r,data){
    let [parent, key] = traverse(root,segments);
    parent[key](data);
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

export { Context, Network };
