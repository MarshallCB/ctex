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

<div align="center">Observable objects for simple state management</div>

## Features
- Defined with an object literal (simple!)
- Every property is observable (can be subscribed to)
- Composable (Contexts can contain other Contexts)
- Effortlessly synchronize with browser storage (IndexedDB)
- Small (~1kB)

## API

### `Model`

`Model` is used to define a set of stateful behaviors. Think of these like data components.
When a model is invoked, it creates a (`Ctex`)[#Ctex]

**Person.js**
In this file, we define a Person with `{name, age}` defaults.
```js
import { Model } from 'ctex';

export let Person = Model({
  name: "No name",
  age: 0
})
```

**example.js**
```js
import { Person } from './Person.js';

// Creating multiple Ctex instances based on the Person model

let marshall = Person({ name: "Marshall" }) // {name: "Marshall", age: 0}
let macy = Person({ name: "Macy", age: 21 }) // {name: "Macy", age: 21}
let anon = Person() // {name: "No name", age: 0}
```

### `Ctex`

Think of `Ctex` instances like specialized objects that can be subscribed to.

```js

```

### `Network`

`Network` is intended to be a top-level state API that contains multiple contexts and a default state. It allows for asynchronous loading/saving to an external source (such as IndexedDB). It also creates a REST-like API to access any `Ctex` within it.

For example, accessing the innermost value of `{ a: { b: { c: "d" }}}` would look like `network("a/b/c")`
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
