import { iterate, dlv } from './utils'

function parseObject(d){
  let mpn = [[],[],[]]
  Object.getOwnPropertyNames(d)
  .forEach(p => {
    if(p !== 'init')
      mpn[typeof d[p] === 'function' ? 0 : (d[p] && d[p]._isCtex) ? 2 : 1].push(p)
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
    // init() function
    def('init',impn[0].bind(this))
    // root subscription key
    def('r',Symbol())
    // marker
    def('_isCtex',true)
    // subscribers
    def('s',{})
    // succinct way to define generator function to iterate over properties and nodes
    // used by the iterate function in utils
    def(Symbol.iterator,{*a(){yield* impn[2];yield* impn[3]}}.a)
    def('_methods', impn[1])
    def('_properties', impn[2])
    def('_nodes', impn[3])
    
    let values = this.values.bind(this)
    // Set methods
    impn[1].forEach(k => {
      def(k,{
        set(x){ Promise.resolve(definition[k](x)) },
        get(){ return definition[k] },
        enumerable: true
      },true)
    })
    // Set properties
    impn[2].forEach(k => {
      let { get, set } = Object.getOwnPropertyDescriptor(definition,k)
      def('_$'+k,{writable:true},true)
      def(k,get ? {get} : {
        set(x){
          this[`_$${k}`] = set ? set(x) : x;
          if(this.s[k]){
            this.s[k].forEach(f => Promise.resolve(f(x)))
          }
          if(this.s[this.r]){
            this.s[this.r].forEach(f => Promise.resolve(f(values())))
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
    impn[3].forEach(k => {
      this[k] = definition[k]
      this[k] instanceof Ctex ? this[k].set(initial[k]) : this[k]=this[k](initial[k])
    })
    Object.seal(this)
    this.init()
  }
  subscribe(k,fn,id=Symbol()){
    if(typeof k === 'function'){
      fn = k
      k = this.r
    }
    if(!this.s[k]){
      this.s[k] = new Map()
    }
    this.s[k].set(id, fn)
    return ()=>this.s[k].delete(id);
  }
  set(obj={}, recurseFlag=true){
    this._properties.forEach(k => {
      if(obj[k] !== undefined){
        this[k]=obj[k]
      }
    })
    // we want to iterate through the whole tree only for the original caller of set()
    // otherwise, each ctext would set() and cause unnecessary set()'s
    if(recurseFlag){
      iterate(this,(key,ctex)=>{
        ctex.set(dlv(obj,key),false)
      })
    }
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