import {Context} from './Context'

// from https://github.com/lukeed/flattie
function iterate(val, callback, sep='/', key='') {
	var k, pfx = key ? (key + sep) : key;
  if(val!=null){
    if (val._isCtex){
      callback(key,val)
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
  let segments = route.split('/').filter(s=>s.length)
  let a = root
  // remember last key
  let last = segments.pop()
  // traverse to final parent
  for(let s of segments){
    a = a[s]
  }
  // return parent node & final key
  return [a, last];
}



function Network(def){
  let root = Context(def)()
  
  function is(r){
    let [parent, key] = traverse(root,r)
    return parent[key];
  }
  is.get = function(r){
    let [parent, key] = traverse(root,r)
    let ans = parent[key]
    return (ans && ans._isCtex) ? ans.values() : ans;
  };
  is.post = function(r,data){
    let [parent, key] = traverse(root,segments)
    parent[key](data);
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