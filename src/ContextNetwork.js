import Context from './index'
import { Store, set, get, del, keys } from 'idb-keyval'

// from https://github.com/lukeed/flattie
function iter(output, sep, val, key) {
	var k, pfx = key ? (key + sep) : key;
  if(val==null){}
  else if (val._isCtex){
    // pull data and set context
    get(key)
      .then((result) => {
        val.set(result)
      })
      .catch(err => {
        console.log(err)
      })
    // attach saving subscriber
    val.subscribe((data) => set(key, data))

		for (k of val) {
			iter(output, sep, val[k], pfx + k);
		}
  }else if (typeof val != 'object') {
		output[key] = val;
	} else if (Array.isArray(val)) {
		for (k=0; k < val.length; k++) {
			iter(output, sep, val[k], pfx + k);
		}
	} else {
		for (k in val) {
			iter(output, sep, val[k], pfx + k);
		}
	}
}
function flatten(input) {
	var output = {};
	if (typeof input == 'object') {
		iter(output, '/', input, '');
	}
	return output;
}


function traverse(root,route){
  let segments = route.split('/').filter(s=>s.length)
  let a = root
  let last = segments.pop()
  for(let s of segments){
    a = a[s]
  }
  return [a, last];
}
function cleanRoute(r){
}

function ContextNetwork(def){
  root = Context(def)()
  root.subscribe((data) => set('index', data))
  flatten(root)

  function is(r){
    let [parent, key] = traverse(root,r)
    return parent[key];
  }
  is.get = function(r){
    let [parent, key] = traverse(root,r)
    return parent[key];
  };
  is.post = function(r,data){
    let [segments, route] = cleanRoute(r)
    let [parent, key] = traverse(root,segments)
    parent[key](data);
  };
  return is;
}

export { ContextNetwork };