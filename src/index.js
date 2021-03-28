const CTEX = {
  CONTEXT: Symbol('ctex-context'),
  MODEL: Symbol('ctex-model')
}

import { dequal } from 'dequal/lite'

/**
 * TODO:
 * - setter should not be by object since that never occurs
 * - bulk subcribe should use a timer or something to not trigger for every single set() in an OBject.assign()
 * - SETTING with a live context should replace the current context with that actual context
 * - Should be possible to link multiple contexts together seamslessly (neighbors and children)
 */

class CtexInner{
  constructor(definition){
    this.values = {}
    this.subs = {};
    const thisProxy = new Proxy({},{
      get: (_,k) => this.values[k],
      set: (_,k,v) => this.setter(k,v)
    })
    Object.keys(definition).forEach(k => {
      const v = definition[k];
      if(v){
        if(v[CTEX.MODEL]){ v = v({}) }
        if(v[CTEX.CONTEXT]){
          v.$$(()=>this.trigger())
        }
      }
      this.values[k] = typeof v === 'function'
        ? v.bind(thisProxy)
        : v;
    })

    const addSub = (k,cb)=>{
      this.subs[k] = this.subs[k] || new Set()
      this.subs[k].add(cb);
      return ()=>this.subs[k].delete(cb);
    }
    this.$ = new Proxy((cb) => addSub('$',cb),{
      get: (_,k) => (cb) => addSub(k,cb)
    })
    this.$$ = (cb) => addSub('$$',cb)
  }
  propogate(key,args){
    if(key){
      const s = this.subs[key]
      if(s){
        for(const f of s){
          f(...args)
        }
      }
    }
  }
  trigger(key,...args){
    this.propogate(key,args);
    this.propogate('$$',[this.all()])
    // TOTAL TRIGGER (1 per event loop)
    if(!this.triggered){
      this.triggered = true;
      setTimeout(() => {
        this.propogate('$',[this.all()])
        this.triggered = false;
      },0)
    }
  }
  setter(k,v){
    const p = this.values[k];
    if(p && p[CTEX.CONTEXT]){
      // If v is a new ctex reference, replace
      if(p !== v && v && v[CTEX.CONTEXT]){
        this.values[k] = v;
        v.$$(() => this.trigger())
        this.trigger(k,v,p)
      }
      // If v is deeply different, call setter on context
      else if(!dequal(p,v)){
        const prev = { ...p }
        this.trigger(k,Object.assign(p,v), prev);
      }
    } else {
      if(!dequal(p,v)){
        this.values[k] = v;
        this.trigger(k,v,p);
      }
    }
    return true;
  }
  getter(k){
    const v = this.values[k]
    return (v && v[CTEX.CONTEXT]) ? { ...v } : v;
  }
  all(){
    let o = {}
    Object.keys(this.values).forEach(k => {
      if(typeof this.values[k] !== 'function'){
        o[k] = this.getter(k);
      }
    })
    return o;
  }
}

function Model(definition){
  let model_fn = (initial={}) => {
    const inner = new CtexInner(definition);
    Object.keys(initial).forEach(k => {
      inner.setter(k,initial[k])
    })
    let total = inner.all()
    inner.$$(data=>Object.assign(total,data))
    return new Proxy(total,{
      get(_,k){
        if(k === CTEX.CONTEXT){
          return true;
        } else if(k === '$'){
          return inner.$;
        } else if(k === '$$'){
          return inner.$$;
        } else{
          return inner.getter(k);
        }
      },
      set: (_,k,v) => inner.setter(k,v)
    })
  }
  model_fn[CTEX.MODEL] = true;
  return model_fn;
}

const Context = (definition)=>Model(definition)()

export { Model, Context, CTEX }