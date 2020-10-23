import {Context} from './Context'
import { iterate, dlv } from './utils'


function Network(def){
  let root = Context(def)()
  
  function is(r){
    return dlv(root,r);
  }
  is.get = function(r){
    let ans = dlv(root,r);
    return (ans && ans._isCtex) ? ans.values() : ans;
  };
  is.post = function(r,data){
    return dlv(root,r)(data);
  };
  is.save = function(saveFn){
    let cb = (key,ctex) => ctex.subscribe((data) => saveFn(key,data))
    cb('index',root)
    iterate(root, cb)
    return is;
  }
  is.load = function(loadFn){
    let cb = (key,ctex)=>{
      Promise.resolve(loadFn(key))
        .then(v => root.set(v))
        .catch(err => console.log(err))
    }
    cb('index',root)
    iterate(root, cb)
    return is;
  }
  return is;
}

export { Network };