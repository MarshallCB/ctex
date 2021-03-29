var t=Object.prototype.hasOwnProperty;function e(s,r){var i,o;if(s===r)return!0;if(s&&r&&(i=s.constructor)===r.constructor){if(i===Date)return s.getTime()===r.getTime();if(i===RegExp)return s.toString()===r.toString();if(i===Array){if((o=s.length)===r.length)for(;o--&&e(s[o],r[o]););return-1===o}if(!i||"object"==typeof s){for(i in o=0,s){if(t.call(s,i)&&++o&&!t.call(r,i))return!1;if(!(i in r)||!e(s[i],r[i]))return!1}return Object.keys(r).length===o}}return s!=s&&r!=r}const s={CONTEXT:Symbol("ctex-context"),MODEL:Symbol("ctex-model")};class r{constructor(t){this.values={},this.subs={};const e=new Proxy({},{get:(t,e)=>this.values[e],set:(t,e,s)=>this.setter(e,s)});Object.keys(t).forEach(r=>{let i=t[r];i&&(i[s.MODEL]&&(i=i({})),i[s.CONTEXT]&&i.$$(()=>this.trigger())),this.values[r]="function"==typeof i?i.bind(e):i});const r=(t,e)=>(this.subs[t]=this.subs[t]||new Set,this.subs[t].add(e),()=>this.subs[t].delete(e));this.$=new Proxy(t=>r("$",t),{get:(t,e)=>t=>r(e,t)}),this.$$=t=>r("$$",t)}propogate(t,e){if(t){const s=this.subs[t];if(s)for(const t of s)t(...e)}}trigger(t,...e){this.propogate(t,e),this.propogate("$$",[this.all()]),this.triggered||(this.triggered=!0,setTimeout(()=>{this.propogate("$",[this.all()]),this.triggered=!1},0))}setter(t,r){const i=this.values[t];if(i&&i[s.CONTEXT]){if(i!==r&&r&&r[s.CONTEXT])this.values[t]=r,r.$$(()=>this.trigger()),this.trigger(t,r,i);else if(!e(i,r)){const e={...i};this.trigger(t,Object.assign(i,r),e)}}else e(i,r)||(this.values[t]=r,this.trigger(t,r,i));return!0}getter(t){const e=this.values[t];return e&&e[s.CONTEXT]?new Proxy({...e},{get:(t,s)=>e[s],set:(t,s,r)=>(e[s]=r,!0)}):e}all(){let t={};return Object.keys(this.values).forEach(e=>{"function"!=typeof this.values[e]&&(t[e]=this.getter(e))}),t}}function i(t){let e=(e={})=>{const i=new r(t);Object.keys(e).forEach(t=>{i.setter(t,e[t])});let o=i.all();return i.$$(t=>Object.assign(o,t)),new Proxy(o,{get:(t,e)=>e===s.CONTEXT||("$"===e?i.$:"$$"===e?i.$$:i.getter(e)),set:(t,e,s)=>i.setter(e,s)})};return e[s.MODEL]=!0,e}const o=t=>i(t)();export{s as CTEX,o as Context,i as Model};
