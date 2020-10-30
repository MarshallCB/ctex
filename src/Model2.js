// // Model -> define default properties, methods, and contexts
// // Model(otherModel,otherModel,{ ... })
// // Context(...) -> with no built-in prototype (except for subscribe, set, values())
// // Model => Context() with built-in prototype
// // Context() should be a func that assigns all property descriptors and correctly describes their enumerability. If it has a bound(this), it should apply all properties of this first (this is how Models will return the right version of the Context func with additonal presets)

// // Model(...arguments) (other models or object literal)
// // Context(obj literal)
// // ModeledContext(obj literal)

// const {assign, defineProperties} = Object;
// export function create(Record, init) {
//   return arguments.length < 2 ? new Record : assign(new Record, init);
// };
// function parseDefinition(d,impn=[()=>{},[],[],[]],x){
//   Object.getOwnPropertyNames(d)
//   .map(p => {
//     x=d[p]
//     if(p !== 'init'){
//       impn[typeof x === 'function' ? 1 : (x && x._isCtex) ? 3 : 2].push(p)
//     } else{
//       impn[0]=x
//     }
//   })
//   return impn
// }

// export function createModel() {
//   function Model() { if(!(this instanceof Model)) return new Model}
//   const models = [Model];
//   const {prototype} = Model;
//   let defineProp = function (key,value,custom){
//     Object.defineProperty(this,key,custom?value:{value})
//   }.bind(prototype)
//   defineProp('_isCtex',true)
//   defineProp('s',{})
//   defineProperties(prototype,{
//     subscribe(k,fn){
//       // make sure this subscription makes sense
//       if(this[k] !== undefined){
//         // if only function is passed, assume they're subscribing to root function (only 1 arg)
//         if(!fn){
//           fn = k
//           k = ''
//         }
//         // check this[k] in case it's null
//         if(this[k] && this[k]._isCtex){
//           // subscribe to context's root
//           return this[k].subscribe(fn)
//         }
//         this.s[k] = this.s[k]||new Set()
//         this.s[k].add(fn)
//         return ()=>this.s[k].delete(fn)
//       }
//     },
//     set(obj={}){
//       Object.assign(this,obj)
//     },
//     values(){
//       return iterate(this)
//     }
//   })
//   for (let i = 0, {length} = arguments; i < length; i++) {
//     const curr = arguments[i];
//     if (typeof curr === 'function') {
//       defineProperties(prototype, getOwnPropertyDescriptors(curr.prototype));
//       models.push(curr);
//     }
//     else{
//       let impn = parseDefinition(curr)
//       // Set methods
//       impn[1].map(k => {
//         defineProp(k,{
//           // allows for shorthand calls to methods in generator functions: menu.choose = yield it.choice(menu)
//           set(x){ curr[k](x) },
//           get(){ return curr[k] }
//         },true)
//       })
//       // Set properties
//       impn[2].map(k => {
//         let { get, set } = Object.getOwnPropertyDescriptor(curr,k)
//         defineProp('_$'+k,{writable:true},true)
//         defineProp(k,get ? {get} : {
//           set(x){
//             // if custom setter function exists, use returned value from set function
//             x = set ? set.bind(this)(x) : x
//             // ensure that this update changed the value (TODO: always flag?)
//             if(this['_$'+k] !== x){
//               this['_$'+k] = x;
//               // alert subscribers
//               let s = this.s
//               if(s[k]){
//                 for(let f of s[k])
//                   f(x,this)
//               }
//               // root subscription key is '' to not conflict with any other keys
//               if(s['']){
//                 let vals = iterate(this)
//                 for(let f of s[''])
//                   f(this)
//               }
//             }
//           },
//           get(){
//             return this['_$'+k]
//           },
//           enumerable: true
//         },true)
//         // if a custom getter was set, we don't need values
//         if(!get)
//           // set value with default in definition
//           prototype[k] = curr[k]
//       })
//       // set inner nodes
//       impn[3].map(k => {
//         defineProp(k,{
//           // setting a node should invoke the .set() method on such context
//           set(x={}){
//             if(typeof this[k] !== 'function'){
//               this[k].set(x)
//             } else {
//               // if the instance hasn't been invoked yet, invoke the original definition (TODO: improve)
//               this[k] = curr[k](x)
//             }
//           },
//           enumerable: true
//         },true)
//         prototype[k] = curr[k]
//       })
//       // call init function
//       // impn[0].call(this)
//     }
//   }
//   defineProperties(prototype, {constructor: {
//     writable: false,
//     value: Model
//   }});
//   Object.seal(prototype)
//   return defineProperties(Model, {implements: {
//     value: Model => models.includes(Model)
//   }, _isCtex:{value:true}});
// };