<div align="center">
  <img src="https://github.com/marshallcb/ctex/raw/main/meta/ctex.png" alt="ctex" width="150" />
</div>

<h1 align="center">ctex</h1>
<div align="center">
  <a href="https://npmjs.org/package/ctex">
    <img src="https://badgen.now.sh/npm/v/ctex" alt="version" />
  </a>
  <a href="https://bundlephobia.com/result?p=ctex">
    <img src="https://img.badgesize.io/MarshallCB/ctex/main/es.js?compression=brotli" alt="install size" />
  </a>
</div>

<div align="center">Observable objects</div>

# Features
- Defined with an object literal
- Every property is observable (can be subscribed to)
- Composable (Contexts can contain/wrap other Contexts)
- Small (~500B)

# API

## `Context`

Contexts are just like normal objects, but they have two main differences. 

#### 1. Observable

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

#### 2. Actually a function

A Context's value is a function for **saving** and **loading** state. It only returns serializable data (no functions)

**Accessing State** (for saving)
```js
import { Context } from 'ctex'
// -- Plain object --
let obj = { x: 2 }
console.log(obj) // ~> { x: 2 }

// -- Context --
let ctx = Context({ x: 2 })
console.log(ctx()) // ~> { x: 2 }

// -- Same for both --
obj.x = 3;
console.log(obj.x) // ~> 3

ctx.x = 3;
console.log(ctx.x) // ~> 3
```

**Setting State** (for loading)
```js
import { Context } from 'ctex'
// -- Plain object --
let obj = { x: 1, y: 2, z: 3 }
obj = { ...obj, x: 4, y: 5 }

// Context
let ctx = Context({ x: 1, y: 2, z: 3 })
ctx({ x: 4, y: 5 })
```

***Why?***

If we have a Model, we can easily save/restore state for specific instances / Contexts

```js
import { Model } from 'ctex'

let Person = Model({
  name: "No Name",
  age: 0,
  birthday(){
    age++;
  }
})

let marshall = Person({ name: "Marshall", age: 21 })
// Save (to database, local storage, etc)
let saved = JSON.stringify(marshall())
// Load (from database, local storage, etc)
let restored_marshall = Person(JSON.parse(saved))
restored()
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
