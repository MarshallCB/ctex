!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).ctex={})}(this,(function(t){"use strict";class e{constructor(t,i,s){let r=function(t,e,i=!1){Object.defineProperty(this,t,i?e:{value:e})}.bind(this);r("init",t[0].bind(this)),r("r",Symbol()),r("_isCtex",!0),r("s",{}),r(Symbol.iterator,{*a(){yield*t[2],yield*t[3]}}.a);let n=this.values.bind(this);t[1].forEach(t=>{r(t,{set(e){Promise.resolve(i[t](e))},get:()=>i[t],enumerable:!0},!0)}),t[2].forEach(t=>{let{get:e,set:o}=Object.getOwnPropertyDescriptor(i,t);r("_$"+t,{writable:!0},!0),r(t,e?{get:e}:{set(e){this["_$"+t]=o?o(e):e,this.s[t]&&this.s[t].forEach(t=>Promise.resolve(t(e))),this.s[this.r]&&this.s[this.r].forEach(t=>Promise.resolve(t(n())))},get(){return this["_$"+t]},enumerable:!0},!0),e||(this[t]=s[t]||i[t])}),t[3].forEach(t=>{this[t]=i[t],this[t]instanceof e?this[t].set(s[t]||{}):this[t]=this[t](s[t]||{})}),Object.seal(this),this.init()}subscribe(t,e){let i=Symbol();return"function"==typeof t&&(e=t,t=this.r),this.s[t]||(this.s[t]=new Map),this.s[t].set(i,e),()=>this.s[t].delete(i)}set(t){for(let[e,i]of Object.entries(t))void 0!==this[e]&&(this[e]&&this[e]._isCtex?this[e].set(i):this[e]=i)}values(){let t={};for(var e of this)t[e]=this[e]&&this[e]._isCtex?this[e].values():this[e];return t}}function i(t){let{init:i,...s}=t,r=function(t){let e=[[],[],[]];return Object.getOwnPropertyNames(t).forEach(i=>{"init"!==i&&e["function"==typeof t[i]?0:t[i]&&t[i]._isCtex?2:1].push(i)}),e}(s),n=(s={})=>new e([i||(()=>{}),...r],t,s);return n._isCtex=!0,n}function s(t,e,i="/",r=""){var n,o=r?r+i:r;if(null!=t)if(t._isCtex)for(n of(e(r,t),t))s(t[n],e,i,o+n);else if(Array.isArray(t))for(n=0;n<t.length;n++)s(t[n],e,i,o+n);else if("object"==typeof t)for(n in t)s(t[n],e,i,o+n)}function r(t,e){let i=e.split("/").filter(t=>t.length),s=t,r=i.pop();for(let t of i)s=s[t];return[s,r]}t.Context=i,t.Network=function(t){let e=i(t)();function n(t){let[i,s]=r(e,t);return i[s]}return n.get=function(t){let[i,s]=r(e,t),n=i[s];return n&&n._isCtex?n.values():n},n.post=function(t,i){let[s,n]=r(e,segments);s[n](i)},n.save=function(t){let i=(e,i)=>i.subscribe(i=>t(e,i));return i("index",e),s(e,i),n},n.load=function(t){let i=(i,s)=>{Promise.resolve(t(i)).then(t=>e.set(t)).catch(t=>console.log(t))};return i("index"),s(e,i),n},n},Object.defineProperty(t,"__esModule",{value:!0})}));
