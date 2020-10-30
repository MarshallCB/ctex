import {Model} from './Model'
import { iterate, traverse } from './utils'


function Network(def){
  let root = Model(def)()
  
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
    let cb = (key,ctex) => ctex.subscribe((data) => saveFn(key,data))
    cb('index',root)
    iterate(root, cb)
    return is;
  }
  is.pull = function(loadFn){
    // TODO: fix this later
    let cb = (key,ctex)=>{
      Promise.resolve(loadFn(key))
        .then(v => root.set(v))
        .catch(err => console.log(err))
    }
    cb('index',root)
    iterate(root, cb)
    return is;
  }
  is.load = function(keys){
    if(keys){
      keys.map(k => {
        this.pull()
      })
    }
    else{
      // todo: iterate on all objects in index
    }
  }
  return is;
}

export { Network };