function parseObject(def){
  let mpn = [[],[],[]];
  do{
    Object.getOwnPropertyNames(def)
    .concat(Object.getOwnPropertySymbols(def).map(s => s.toString()))
    .forEach(p => {
      let x = def[p];
      mpn[typeof x === 'function' && !mpn[0].includes(0) ? 0 : x.isContext && !mpn[2].includes(p) ? 2 : 1].push(p);
    });
  } while(
    (def = Object.getPrototypeOf(def)) &&   //walk-up the prototype chain
    Object.getPrototypeOf(def)              //not the the Object prototype methods (hasOwnProperty, etc...)
  )

  return mpn
}

// class ContextNode{
//   constructor(d, i){
//     let { init, ...definition } = d
//     this.init = init || (()=>{})
//     this.observers = {}
//     this.isContext = true
//     let [ methods, properties, nodes ] = parseObject(definition)
//     // Set entrypoints
//     methods.forEach(k => {
//       Object.defineProperty(this, k, {
//         set(x){ definition[k](x) },
//         get(){ return definition[k] },
//         enumerable: false
//       })
//     })
//     // Set endpoints
//     properties.forEach(k => {
//       this.observers[k] = []
//       Object.defineProperty(this, k, {
//         set(x){
//           this[`_$${k}`] = x;
//           this.observers[k].forEach(f => f(x))
//         },
//         get(){
//           return this[`_$${k}`]
//         },
//         enumerable: true
//       })
//       this[k] = definition[k]
//     })
//     // set inner nodes
//     nodes.forEach(k => {
//       this[k] = definition[k]
//     })
//   }
//   observe(k, fn){
//     this.observers[k].push(fn)
//   }
// }



// function Context(definition){

//   return (initial) => {

//     if (this instanceof Context === false) { return new Context(schema) }
//     let c = new ContextNode(definition, initial)
//     c.init()
//     return c;
//   }
// }

function Context(d){
  let { init, ...definition } = d;
  let [ methods, properties, nodes ] = parseObject(definition);
  function ContextNode(initial){
    if (this instanceof ContextNode === false) { return new ContextNode(initial) }
    this.init = init || (()=>{});
    this.observers = {};
    this.isContext = true;
    // Set entrypoints
    methods.forEach(k => {
      Object.defineProperty(this, k, {
        set(x){ definition[k](x); },
        get(){ return definition[k] },
        enumerable: false
      });
    });
    // Set endpoints
    properties.forEach(k => {
      this.observers[k] = [];
      Object.defineProperty(this, k, {
        set(x){
          this[`_$${k}`] = x;
          this.observers[k].forEach(f => f(x));
        },
        get(){
          return this[`_$${k}`]
        },
        enumerable: true
      });
      this[k] = initial[k] || definition[k];
    });
    // set inner nodes
    nodes.forEach(k => {
      this[k] = definition[k];
      this[k].set(initial[k] || {});
    });
    this.init();
  }
  ContextNode.prototype.observe = function(k,fn){
    this.observers[k].push(fn);
  };
  ContextNode.prototype.set = function(obj){
    for(let [k,v] of Object.entries(obj))
      this[k]=v;
  };
  ContextNode.prototype.values = function(){
    let ans = {};
    properties.forEach(k => ans[k]=this[k]);
    nodes.forEach(k=>ans[k]=this[k].values());
    return ans
  };
  return ContextNode
}

export default Context;
