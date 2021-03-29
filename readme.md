<div align="center">
  <img src="https://github.com/marshallcb/ctex/raw/main/meta/ctex.png" alt="ctex" width="150" />
</div>

<h1 align="center">ctex</h1>
<h3 align="center">Observable objects</h3>
<div align="center">
  <a href="https://npmjs.org/package/ctex">
    <img src="https://badgen.now.sh/npm/v/ctex" alt="version" />
  </a>
  <a href="https://bundlephobia.com/result?p=ctex">
    <img src="https://img.badgesize.io/MarshallCB/ctex/main/es.js?compression=brotli" alt="install size" />
  </a>
</div>


# Features
- Works like a normal object literal
- Every property can be subscribed to
- Composable (Contexts can contain/wrap other Contexts)

# API

## `Context`

Contexts mostly behave like normal objects. Internally, they behave differently to allow for subscribable properties and to simplify serializing state.

### Subscribable properties

Contexts and each of their properties can be subscribed to using the `$` helper.

**Subscribing to all changes:** `ctx.$(callback)`
```js
import { Context } from 'ctex'

let counter = Context({
  x: 0,
  y: 0,
  inc(){
    this.x++;
  }
})

// Callback is invoked when counter's data updates
counter.$( ({ x, y }) => {
  console.log(`Here with x=${x} and y=${y}`)
} )

counter.inc()
// ~> Here with x=1 and y=0
counter.y = 7
// ~> Here with x=1 and y=7
```

**Subscribing to specific properties:** `ctx.$.<property>(callback)`
```js
import { Context } from 'ctex'

let counter = Context({
  x: 0,
  y: 0,
  inc(){
    this.x++;
  }
})

// Callback is invoked only when y changes
counter.$.y( (value, prev) => {
  console.log(`y changed from ${prev} to ${value}`)
} )

counter.inc()
// *callback not triggered because y hasn't changed*
counter.y = 7
// ~> y changed from 0 to 7
```

***Why?***

If we have a Model, we can easily save/restore state for specific instances / Contexts

```js
import { Model } from 'ctex'

let Person = Model({
  name: "No Name",
  age: 0,
  birthday(){
    this.age++
  }
})

let marshall = Person({ name: "Marshall", age: 21 })
// Save (to database, local storage, etc)
let serialized = JSON.stringify(marshall)
// Load (from database, local storage, etc)
let restored = Person(JSON.parse(serialized))
console.log(restored)
// ~> { name: "Marshall", age: 21 }
```


### `Model`

Models are templates for Contexts. When a model function is invoked, it creates a [`Context`](#Context) object.

**Person.js**

In this file, we define a Person Model with `{name, age}` defaults.

```js
import { Model } from 'ctex';

export let Person = Model({
  name: "No name",
  age: 0,
  birthday(){
    this.age++;
  }
})
```

**example.js**

In this file, we create a `Person` Context

```js
import { Person } from './Person.js';

// Create a Person Context and override the `name` value
let marshall = Person({ name: "Marshall" })
// Get current values
marshall() // ~> { name: "Marshall", age: 0 }
// Set `age` property
marshall.age = 21
// Call Person `birthday` method
marshall.birthday()
// Get age value
marshall.age // ~> 22
// Set multiple properties at a time (shortcut)
marshall({
  age: 30,
  name: "Marshall2"
}) // ~> { name: "Marshall2", age: 30 }

// Subscribe to all property changes
marshall.$(({ age, name }) => {
  console.log("marshall has changed")
})

// Subscribe to when age changes
marshall.$.age((age, prev_age) => {
  console.log("marshall is older now")
})

```

# How it Works

The power of the [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

## License

MIT © [Marshall Brandt](https://m4r.sh)
