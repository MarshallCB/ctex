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

`Model`s are templates for Contexts. When a model is invoked, it creates a [`Context`](#Context) object.

---

**Person.js**

In this file, we define a Person with `{name, age}` defaults.

```js
import { Model } from 'ctex';

export let Person = Model({
  name: "No name",
  age: 0
})
```

---

**example.js**

In this file, we create multiple 'Person' Contexts
```js
import { Person } from './Person.js';

// Creating multiple Ctex instances based on the Person model

let marshall = Person({ name: "Marshall" }) // {name: "Marshall", age: 0}
let macy = Person({ name: "Macy", age: 21 }) // {name: "Macy", age: 21}
let anon = Person() // {name: "No name", age: 0}
```

### `Context`

Think of `Context` instances like specialized objects that can be subscribed to.

```js
import { Context } from 'ctex';

let game = Context({
  red: 0,
  blue: 0,
  goal(team){
    if(team === 'red')
      this.red += 1;
    if(team === 'blue')
      this.blue += 1;
  }
})

// Subscribe to the "red" property in game
game.subscribe('red', (redScore) => {
  console.log("RED!!! "+redScore);
})
// Subscribe to the "blue" property in game
game.subscribe('blue', (blueScore) => {
  console.log("blue!! "+blueScore);
})

// Subscribe to all property updates
// values passed into callback function are the same as game.values()
game.subscribe((values) => {
  // console.log(values)
})

// invoke the "goal" method in game
game.goal('blue');  // ~> blue!! 1
game.goal('blue');  // ~> blue!! 2
game.goal('red');   // ~> RED!!! 1

// Get all the values in game
game.values() // ~> { red: 1, blue: 2 }

// Each property is directly readable
console.log(game.blue) // ~> 2
console.log(game.red) // ~> 1

// Each property can be directly set
game.red = 3;   // ~> RED!!! 3

// Set multiple properties at once (and notify subscribers)
game.set({ blue: 0, red: 0 })
// ~> blue!! 0
// ~> RED!!! 0

// ~ Special feature ~
// Call context methods by setting
// This is useful for generator functions
game.goal = 'blue' // equivalent to: game.goal('blue')


```

### `Network`

`Network` is intended to be a top-level state API that contains multiple contexts and a default state. It allows for asynchronous loading/saving to an external source (such as IndexedDB). It also creates a REST-like API to access any `Ctex` within it.

For example, accessing the innermost value of `{ a: { b: { c: "d" }}}` would look like `network("a/b/c")`

```js
import { Network, Context, Model } from 'ctex';

let is = Network({
  name: "",
  notes: Context({
    all: [],
    addNote(text){
      this.all.push(text)
    }
  })
}).load((key) => {
  // fetch data, return value or Promise
}).save((key, data) => {
  // save data to external location
})
```

## License

MIT © [Marshall Brandt](https://m4r.sh)
