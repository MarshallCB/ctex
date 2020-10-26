// from https://github.com/lukeed/flattie
export function iterate(val, callback=(()=>{}), sep='/', key='', out={}) {
  var k, pfx = key ? (key + sep) : key;
  if (Array.isArray(val)) {
    for (k=0; k < val.length; k++) {
      iterate(val[k], callback, sep, pfx+k, out);
    }
  } else if(val && typeof val == 'object') {
    if(val._isCtex)
      callback(key,val)
    for (k in val) {
      iterate(val[k], callback, sep, pfx+k, out);
    }
  } else {
    dset(out, key, val)
  }
  return out;
}

// from https://github.com/lukeed/dset/
export function dset(obj,keys,val){
  keys=keys.split('/');
  var i=0, l=keys.length, t=obj, x;
  for (; i < l; ++i) {
    x = t[keys[i]];
    t = t[keys[i]] = (i === l - 1 ? val : (x != null ? x : (!!~keys[i+1].indexOf('.') || !(+keys[i+1] > -1)) ? {} : []));
  }
}

// from https://github.com/developit/dlv
export function traverse(obj, key, p, undef) {
  key = key.split('/');
  let o = obj
	for (p = 0; p < key.length; p++) {
		o = o ? o[key[p]] : undef;
	}
	return o;
}