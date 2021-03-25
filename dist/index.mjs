const CTEX = {
  CONTEXT: Symbol('ctex-context'),
  MODEL: Symbol('ctex-model')
};

class CtexInner{
  constructor(values, subs){
    Object.assign(this,{values,subs});
    const addSub = (k,cb)=>{
      this.subs[k] = this.subs[k] || new Set();
      this.subs[k].add(cb);
      return ()=>this.subs[k].delete(cb);
    };
    this.$ = new Proxy((cb) => addSub('',cb),{
      get: (_,k) => (cb) => addSub(k,cb)
    });
  }
  setter(o){
    let triggers = []; // [[sub_key, value]]
    // UPDATE VALUES
    for(const k in o){
      const v = o[k];
      const p = this.values[k];
      if(p && p[CTEX.CONTEXT]){
        // TODO: check for deep equal
        triggers.push([k,p(v)]);
      } else {
        // TODO: check for deep equal
        if(p !== v){
          this.values[k] = v;
          triggers.push([k,v]);
        }
      }
    }
    // TRIGGER SUBSCRIBERS
    if(triggers.length > 0){
      // Add "total" trigger if some value changed
      triggers.push(['', this.all()]);
      triggers.forEach( ([sub_key,value]) => {
        const s = this.subs[sub_key];
        if(s){
          for(const f of s){
            f(value);
          }
        }
      });
    }
  }
  getter(k){
    const v = this.values[k];
    return (v && v[CTEX.CONTEXT]) ? v() : v;
  }
  all(){
    let o = {};
    Object.keys(this.values).forEach(k => {
      if(typeof this.values[k] !== 'function'){
        o[k] = this.getter(k);
      }
    });
    return o;
  }
}

function Model(definition){
  let model_fn = (initial={}) => {
    let inner = new CtexInner(Object.assign({},definition,initial), {});

    return new Proxy(function(o){
      inner.setter(o);
      return inner.all();
    },{
      get(_,k){
        if(k === CTEX.CONTEXT){
          return true;
        } else if(k === '$'){
          return inner.$;
        } else {
          return inner.getter(k);
        }
      },
      set(_,k,v){
        inner.setter({ [k]: v });
        return true;
      }
    })
  };
  model_fn[CTEX.MODEL] = true;
  return model_fn;
}

let Context = (definition)=>Model(definition)();

export { CTEX, Context, Model };
