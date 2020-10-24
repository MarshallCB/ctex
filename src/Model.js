import { iterate } from './utils'

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

class Ctex{
  constructor(impn,definition,initial){
    // this.init = impn[0].bind(this)
    let def = function(key,value,custom=false){
      Object.defineProperty(this,key,custom?value:{value})
    }.bind(this)
    // marker
    def('_isCtex',true)
    // subscribers
    def('s',{})
    // succinct way to define generator function to iterate over properties and nodes
    // used by the iterate function in utils
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
      let { get, set } = Object.getOwnPropertyDescriptor(definition,k)
      def('_$'+k,{writable:true},true)
      def(k,get ? {get} : {
        set(x){
          x = set ? set(x) : x
          if(this['_$'+k] !== x){
            this['_$'+k] = x;
            let s = this.s
            if(s[k]){
              for(let f of s[k])
                Promise.resolve(f(x))
            }
            if(s['']){
              let vals = iterate(this)
              for(let f of s[''])
                Promise.resolve(f(vals))
            }
          }
        },
        get(){
          return this['_$'+k]
        },
        enumerable: true
      },true)
      if(!get)
        this[k] = initial[k] || definition[k]
    })
    // set inner nodes
    impn[3].map(k => {
      def(k,{
        set(x={}){
          if(this[k] instanceof Ctex){
            this[k].set(x)
          } else {
            this[k] = definition[k](x)
          }
        },
        enumerable: true
      },true)
      this[k] = initial[k]
    })
    Object.seal(this)
    // call init function
    impn[0].bind(this)()
  }
  subscribe(k,fn){
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
  }
  set(obj={}){
    Object.assign(this,obj)
  }
  values(){
    return iterate(this)
  }
}

function Model(definition){
  let fn = (initial) => Context(definition,initial)
  fn._isCtex = true;
  return fn;
}

function Context(definition,initial={}){
  return new Ctex(parseDefinition(definition),definition,initial)
}

export { Model, Context }