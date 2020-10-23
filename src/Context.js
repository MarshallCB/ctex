import { iterate } from './utils'

function parseObject(d,x){
  let mpn = [[],[],[]]
  Object.getOwnPropertyNames(d)
  .forEach(p => {
    if(p !== 'init'){
      x=d[p]
      mpn[typeof x === 'function' ? 0 : (x && x._isCtex) ? 2 : 1].push(p)
    }
  })
  return mpn
}

// TODO: try replacing Map() with {}
// TODO: generalize flattie to improve values() and set() for arrays and objects
// TODO: include flag for whether root subscription should trigger save (no if from internal node)

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
          this[`_$${k}`] = x;
          let s = this.s
          if(s[k]){
            for(let f of s[k])
              Promise.resolve(x)
          }
          if(s['']){
            let vals = iterate(this)
            for(let f of s[''])
              Promise.resolve(vals)
          }
        },
        get(){
          return this[`_$${k}`]
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
  subscribe(k,fn,id=Symbol()){
    if(this[k] !== undefined){
      // if only function is passed, assume they're subscribing to root function
      if(!fn){
        fn = k
        k = ''
      }
      if(this[k] && this[k]._isCtex){
        // subscribe to context's root
        return this[k].subscribe(fn)
      }
      this.s[k] = this.s[k]||new Set()
      this.s[k].add(fn)
      return ()=>this.s[k].delete(fn)
    }
  }
  set(obj={}, recurseFlag=true){
    Object.assign(this,obj)
  }
  values(){
    return iterate(this)
  }
}

function Context(definition){
  let { init, ...rest } = definition
  let mpn = parseObject(rest)
  let fn = (initial={}) => new Ctex([init || (()=>{}),...mpn],definition,initial)
  fn._isCtex = true;
  return fn;
}

export { Context }