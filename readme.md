<div align="center">
  <img src="https://github.com/marshallcb/ctex/raw/main/ctex.png" alt="ctex" width="150" />
</div>

<h1 align="center">ctex</h1>
<div align="center">
  <a href="https://npmjs.org/package/ctex">
    <img src="https://badgen.now.sh/npm/v/ctex" alt="version" />
  </a>
  <a href="https://bundlephobia.com/result?p=ctex">
    <img src="https://img.badgesize.io/MarshallCB/ctex/main/min.js?compression=brotli" alt="install size" />
  </a>
</div>

<div align="center">Simple observable objects</div>

## Features
- Defined with an object literal (simple!)
- Every property is observable
- Composable (Contexts can contain other Contexts)
- Effortlessly synchronize with browser storage (IndexedDB)
- Easily create a NodeJS API with a DB connection
- Small (~1kB)

## Nutshell
1. Write class-like definitions for intuitive, observable, and composable state
2. Subscribe to updates in element init() 
```js
// Ideas
this.example = is('example')
this.is('example')
this.is.subscribe(this.render)
this.is = is('example','example2','global', { name: "" })
```
3. is() should auto-subscribe to save to idb / restore data from idb
4. if logged in, is() should auto-subscribe to sync with remote

## Usage
```js
// test.js
import Context from 'ctex';

let Test = Context({
  init(){ // guaranteed to run when context has been created. not required
    console.log("initing")
  },
  value: 1, //property
  hello: "Marshall", //property
  increment(x=1){ // method
    this.value+=x;
  }
})

// index.js
import Test from './test.js'

let t = Test({ value: 2 }); // OR let t = new Test({ value: 2})
// "initing"
console.log(t.value); // 2

t.observe('value', (x) => {
  console.log("observed that! ",x)
})

t.increment()
// "observed that! 3"
t.set({hello:"Macy",value:10})
// "observed that! 10"
console.log(t.values()) // return properties & nested context properties in object form
```

## Special Features

**Call functions by setting the function name**
(this helps with generator functions)
```js
  // following previous example
  t.increment = 3
  // "observed that! 13"

  // in a generator function:
  t.increment = yield "How much to increment by?"
```

## License

MIT © [Marshall Brandt](https://m4r.sh)
