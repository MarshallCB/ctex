import { iterate } from './utils'

function parseDefinition(d,x){
  let impn = [()=>{},[],[],[]]
  Object.getOwnPropertyNames(d)
  .map(p => {
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
  /**
   * impn: array of form [init,methods,properties,nodes]
   * definition: original Model / Context definition schema
   * initial: possible initial values
   */
  constructor(impn,definition,initial={}){
    // shortcut function to define property (with different defaults than this[key] assignments)
    let defineProp = function(key,value,custom){
      Object.defineProperty(this,key,custom?value:{value})
    }.bind(this)
    // marker (allow other functions treat us like Ctex instances)
    defineProp('_isCtex',true)
    // subscribers (s for brevity)
    defineProp('s',{})
    
    // Set methods
    impn[1].map(k => {
      defineProp(k,{
        // allows for shorthand calls to methods in generator functions: menu.choose = yield it.choice(menu)
        set(x){ definition[k](x) },
        get(){ return definition[k] }
      },true)
    })
    // Set properties
    impn[2].map(k => {
      let { get, set } = Object.getOwnPropertyDescriptor(definition,k)
      defineProp('_$'+k,{writable:true},true)
      defineProp(k,get ? {get} : {
        set(x){
          // if custom setter function exists, use returned value from set function
          x = set ? set.bind(this)(x) : x
          // ensure that this update changed the value (TODO: always flag?)
          if(this['_$'+k] !== x){
            this['_$'+k] = x;
            // alert subscribers
            let s = this.s
            if(s[k]){
              for(let f of s[k])
                f(x,this)
            }
            // root subscription key is '' to not conflict with any other keys
            if(s['']){
              let vals = iterate(this)
              for(let f of s[''])
                f(this)
            }
          }
        },
        get(){
          return this['_$'+k]
        },
        enumerable: true
      },true)
      // if a custom getter was set, we don't need values
      if(!get)
        // set value with default in definition
        this[k] = initial[k] || definition[k]
    })
    // set inner nodes
    impn[3].map(k => {
      defineProp(k,{
        // setting a node should invoke the .set() method on such context
        set(x={}){
          if(this[k] instanceof Ctex){
            this[k].set(x)
          } else {
            // if the instance hasn't been invoked yet, invoke the original definition (TODO: improve)
            this[k] = definition[k](x)
          }
        },
        enumerable: true
      },true)
      this[k] = initial[k]
    })
    // Prevent object from being modified, but values can be written to
    Object.seal(this)
    // call init function
    impn[0].call(this)
  }
  // subscribe(key, fn)  => keyed subscription
  // subscribe(fn) => root subscription (listen for all updates)
  subscribe(k,fn){
    // make sure this subscription makes sense
    if(this[k] !== undefined){
      // if only function is passed, assume they're subscribing to root function (only 1 arg)
      if(!fn){
        fn = k
        k = ''
      }
      // check this[k] in case it's null
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
  let impn = parseDefinition(definition)
  let fn = (initial) => new Ctex(impn,definition,initial)
  fn._isCtex = true;
  return fn;
}

let Context = (definition)=>Model(definition)()

export { Model, Context }