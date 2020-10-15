<div align="center">
  <img src="https://github.com/marshallcb/ctex/raw/main/ctex.png" alt="ctex" width="100" />
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

<div align="center">Simple state management</div>

## Features
- Defined with an object literal
- Every property is observable
- Composable

## Nutshell
Write class-like definitions to capture state.

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
