!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).ctex={})}(this,(function(e){"use strict";function t(e,n=(()=>{}),i="/",r="",s={}){var o,f=r?r+i:r;if(e&&e._isCtex)for(o of(n(r,e),e))t(e[o],n,i,f+o,s);else if(Array.isArray(e))for(o=0;o<e.length;o++)t(e[o],n,i,f+o,s);else if(e&&"object"==typeof e)for(o in e)t(e[o],n,i,f+o,s);else!function(e,t,n){t=t.split("/");for(var i,r=0,s=t.length,o=e;r<s;++r)i=o[t[r]],o=o[t[r]]=r===s-1?n:null!=i?i:!~t[r+1].indexOf(".")&&+t[r+1]>-1?[]:{}}(s,r,e);return s}function n(e,t,n,i){t=t.split("/");let r=e;for(n=0;n<t.length;n++)r=r?r[t[n]]:i;return r}function i(e){let n=n=>new(function(e,n={}){function i(){}const{prototype:l}=i;function u(e,t,n=!1){r(l,e,n?t:{value:t})}let c=function(e,t){let n=[()=>{},[],[],[]];return Object.getOwnPropertyNames(e).forEach(i=>{t=e[i],"init"!==i?n["function"==typeof t?1:t&&t._isCtex?3:2].push(i):n[0]=t}),n}(e);return u("s",{}),u(Symbol.iterator,{*a(){yield*c[2],yield*c[3]}}.a),c[1].map(t=>{u(t,{set(n){Promise.resolve(e[t](n))},get:()=>e[t],enumerable:!0},!0)}),c[2].map(i=>{let{get:r,set:o}=s(e,i);u("_$"+i,{writable:!0},!0),u(i,r?{get:r}:{set(e){if(e=o?o(e):e,l["_$"+i]!==e){l["_$"+i]=e;let n=l.s;if(n[i])for(let t of n[i])Promise.resolve(t(e));if(n[""]){let e=t(l);for(let t of n[""])Promise.resolve(t(e))}}},get:()=>l["_$"+i],enumerable:!0},!0),r||(l[i]=n[i]||e[i])}),c[3].map(t=>{u(t,{set(n={}){l[t]instanceof i?l[t].set(n):l[t]=e[t](n)},enumerable:!0},!0),l[t]=n[t]}),f(l,{subscribe(e,t,n=Symbol()){if(void 0!==this[e])return t||(t=e,e=""),t=t.bind(this),this[e]&&this[e]._isCtex?this[e].subscribe(t):(this.s[e]=this.s[e]||new Set,this.s[e].add(t),()=>this.s[e].delete(t))},set(e={},t=!0){f(this,e)},values(){return t(this)}}),u("constructor",i),u("_isCtex",!0),o(l),c[0].bind(l)(),i}(e,n));return n._isCtex=!0,n}let{defineProperty:r,getOwnPropertyDescriptor:s,seal:o,assign:f}=Object;e.Model=i,e.Network=function(e){let r=i(e)();function s(e){return n(r,e)}return s.get=function(e){let t=n(r,e);return t&&t._isCtex?t.values():t},s.post=function(e,t){return n(r,e)(t)},s.save=function(e){let n=(t,n)=>n.subscribe(n=>e(t,n));return n("index",r),t(r,n),s},s.load=function(e){let n=(t,n)=>{Promise.resolve(e(t)).then(e=>r.set(e)).catch(e=>console.log(e))};return n("index"),t(r,n),s},s},Object.defineProperty(e,"__esModule",{value:!0})}));
