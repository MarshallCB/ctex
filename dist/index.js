'use strict';

function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}

function parseObject(def){
  let methods = [];
  let properties = [];
  let nodes = [];
  let flows = [];
  do{
    Object.getOwnPropertyNames(def)
    .concat(Object.getOwnPropertySymbols(def).map(s => s.toString()))
    .sort()
    .forEach((p, i, arr) => {
      if(
        p !== 'constructor' && // not the constructor
        (i == 0 || p !== arr[i-1]) // not overriding in this prototype
      ){
        if(typeof def[p] === 'function' && methods.indexOf(p) === -1){
          if(isGeneratorFunction(def[p])){
            flows.push(p);
          } else {
            methods.push(p);
          }
        } else if (def[p].isContext && nodes.indexOf(p) === -1){
          nodes.push(p);
        } else {
          properties.push(p);
        }
      }
    });
  } while(
    (def = Object.getPrototypeOf(def)) &&   //walk-up the prototype chain
    Object.getPrototypeOf(def)              //not the the Object prototype methods (hasOwnProperty, etc...)
  )

  return [methods, properties, nodes, flows]
}

class ContextNode{
  constructor(d){
    let { init, ...definition } = d;
    this.init = init ? init : ()=>{};
    this.observers = {};
    this.isContext = true;
    let [ methods, properties, nodes, flows ] = parseObject(definition);
    // Set entrypoints
    methods.forEach(k => {
      Object.defineProperty(this, k, {
        set(x){ definition[k](x); },
        get(){ return definition[k] },
        enumerable: false,
        configurable: false
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
        enumerable: true,
        configurable: false
      });
      this[k] = definition[k];
    });
    // set inner nodes
    nodes.concat(flows).forEach(k => {
      this[k] = definition[k];
    });
  }
  observe(k, fn){
    this.observers[k].push(fn);
  }
}



function Context(d){
  return (props) => {
    let c = new ContextNode(d);
    c.init(props);
    return c;
  }
}

module.exports = Context;
