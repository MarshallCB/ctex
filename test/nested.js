import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Model } from '../dist'

// Define Models
export let Child = Model({
  cookies: 0,
  name: "",
  age: 0,
  happy: false,
  init(){
    this.subscribe('cookies',function(num){
      this.happy = num > 0
    })
  },
  stealCookie(){
    this.cookies = 1;
  },
  caught(){
    this.cookies = 0;
  }
})

export let Parent = Model({
  name: "",
  kids: [],
  checkJar(){
    this.kids.map(kid => kid.caught())
  }
})

// Initialize 



const nested = suite('nested');

let parent

nested('Initializing nested context', () => {
  parent = Parent({
    name: "J",
    kids: [
      Child({
        name: "John",
        age: 10
      }),
      Child({
        name: "Jane",
        age: 12
      })
    ]
  })
  assert.equal(parent.values(), {
    name: "J",
    kids: [
      { name: "John", age: 10, cookies: 0, happy: false },
      { name: "Jane", age: 12, cookies: 0, happy: false }
    ]
  })
});

nested.run()