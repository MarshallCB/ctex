function t(e,i=(()=>{}),s="/",n="",r={}){var o,l=n?n+s:n;if(e&&e._isCtex)for(o of(i(n,e),e))t(e[o],i,s,l+o,r);else if(Array.isArray(e))for(o=0;o<e.length;o++)t(e[o],i,s,l+o,r);else if(e&&"object"==typeof e)for(o in e)t(e[o],i,s,l+o,r);else!function(t,e,i){e=e.split("/");for(var s,n=0,r=e.length,o=t;n<r;++n)s=o[e[n]],o=o[e[n]]=n===r-1?i:null!=s?s:!~e[n+1].indexOf(".")&&+e[n+1]>-1?[]:{}}(r,n,e);return r}function e(t,e,i,s){e=e.split("/");let n=t;for(i=0;i<e.length;i++)n=n?n[e[i]]:s;return n}class i{constructor(e,s,n={}){let r=function(t,e,i){Object.defineProperty(this,t,i?e:{value:e})}.bind(this);r("_isCtex",!0),r("s",{}),r(Symbol.iterator,{*a(){yield*e[2],yield*e[3]}}.a),e[1].map(t=>{r(t,{set(e){Promise.resolve(s[t](e))},get:()=>s[t],enumerable:!0},!0)}),e[2].map(e=>{let{get:i,set:o}=Object.getOwnPropertyDescriptor(s,e);r("_$"+e,{writable:!0},!0),r(e,i?{get:i}:{set(i){if(i=o?o(i):i,this["_$"+e]!==i){this["_$"+e]=i;let s=this.s;if(s[e])for(let t of s[e])t(i,this);if(s[""]){t(this);for(let t of s[""])t(this)}}},get(){return this["_$"+e]},enumerable:!0},!0),i||(this[e]=n[e]||s[e])}),e[3].map(t=>{r(t,{set(e={}){this[t]instanceof i?this[t].set(e):this[t]=s[t](e)},enumerable:!0},!0),this[t]=n[t]}),Object.seal(this),e[0].call(this)}subscribe(t,e){if(void 0!==this[t])return e||(e=t,t=""),this[t]&&this[t]._isCtex?this[t].subscribe(e):(this.s[t]=this.s[t]||new Set,this.s[t].add(e),()=>this.s[t].delete(e))}set(t={}){Object.assign(this,t)}values(){return t(this)}}function s(t){let e=function(t,e){let i=[()=>{},[],[],[]];return Object.getOwnPropertyNames(t).map(s=>{e=t[s],"init"!==s?i["function"==typeof e?1:e&&e._isCtex?3:2].push(s):i[0]=e}),i}(t),s=s=>new i(e,t,s);return s._isCtex=!0,s}function n(i){let n=s(i)();function r(t){return e(n,t)}return r.get=function(t){let i=e(n,t);return i&&i._isCtex?i.values():i},r.post=function(t,i){return e(n,t)(i)},r.save=function(e){let i=(t,i)=>i.subscribe(i=>e(t,i));return i("index",n),t(n,i),r},r.load=function(e){let i=(t,i)=>{Promise.resolve(e(t)).then(t=>n.set(t)).catch(t=>console.log(t))};return i("index"),t(n,i),r},r}export{s as Model,n as Network};
