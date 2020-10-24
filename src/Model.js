import { iterate } from './utils'

let { defineProperty, getOwnPropertyDescriptor, seal, assign } = Object

function parseDefinition(d,x){
  let impn = [()=>{},[],[],[]]
  Object.getOwnPropertyNames(d)
  .forEach(p => {
    x=d[p]
    if(p !== 'init'){
      impn[typeof x === 'function' ? 1 : (x && x._isCtex) ? 3 : 2].push(p)
    } else{
      impn[0]=x
    }
  })
  return impn
}

function define(definition,initial={}){
  function Ctex() {}
  const {prototype} = Ctex;
  function def(key,value,custom=false){
    defineProperty(prototype,key,custom?value:{value})
  }

  let impn = parseDefinition(definition)
  def('s',{})
  def(Symbol.iterator,{*a(){yield* impn[2];yield* impn[3]}}.a)
  // Set methods
  impn[1].map(k => {
    def(k,{
      set(x){ Promise.resolve(definition[k](x)) },
      get(){ return definition[k] },
      enumerable: true
    },true)
  })
  // Set properties
  impn[2].map(k => {
    let { get, set } = getOwnPropertyDescriptor(definition,k)
    def('_$'+k,{writable:true},true)
    def(k,get ? {get} : {
      set(x){
        x = set ? set(x) : x
        if(prototype['_$'+k] !== x){
          prototype['_$'+k] = x;
          let s = prototype.s
          if(s[k]){
            for(let f of s[k])
              Promise.resolve(f(x))
          }
          if(s['']){
            let vals = iterate(prototype)
            for(let f of s[''])
              Promise.resolve(f(vals))
          }
        }
      },
      get(){
        return prototype['_$'+k]
      },
      enumerable: true
    },true)
    if(!get)
      prototype[k] = initial[k] || definition[k]
  })
  // set inner nodes
  impn[3].map(k => {
    def(k,{
      set(x={}){
        if(prototype[k] instanceof Ctex){
          prototype[k].set(x)
        } else {
          prototype[k] = definition[k](x)
        }
      },
      enumerable: true
    },true)
    prototype[k] = initial[k]
  })
  // set built-in methods

  assign(prototype,{
    subscribe(k,fn,id=Symbol()){
      if(this[k] !== undefined){
        // if only function is passed, assume they're subscribing to root function
        if(!fn){
          fn = k
          k = ''
        }
        fn=fn.bind(this)
        if(this[k] && this[k]._isCtex){
          // subscribe to context's root
          return this[k].subscribe(fn)
        }
        this.s[k] = this.s[k]||new Set()
        this.s[k].add(fn)
        return ()=>this.s[k].delete(fn)
      }
    },
    set(obj={}){
      assign(this,obj)
    },
    values(){
      return iterate(this)
    }
  })

  def('constructor', Ctex)
  def('_isCtex', true)
  seal(prototype)
  impn[0].bind(prototype)()

  return Ctex;
}

function Model(definition){
  let fn = (initial) => new (define(definition,initial))()
  fn._isCtex = true;
  return fn;
}
function Context(definition,initial={}){
  // return new Ctex(parseDefinition(definition),definition,initial)
  let c = define(definition, initial)
  return new c();
}

export { Model, Context }