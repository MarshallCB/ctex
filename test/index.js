import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {Context} from '../dist';

const API = suite('exports');

API('should export an function', () => {
	assert.type(Context, 'function');
});

API('should return a function', () => {
	assert.type(Context({}), 'function');
});

API('uninvoked definition should have _isCtex', () => {
	assert.is(Context({})._isCtex, true);
});

API('invoked definition should have _isCtex', () => {
	assert.is(Context({})()._isCtex, true);
});

API.run();

const properties = suite('properties');

var Person = Context({
  name: "Marshall",
  age: 0,
  fact: null,
  cool: false
});

let marshall = Person()
let macy = Person({
  age: 21,
  fact: "Hey I'm super cool",
  cool: true,
  name: "Macy"
})
let shaz = Person({
  age: 444,
  name: "Shaz"
})

properties('defaults should be used', () => {
	assert.is(marshall.name, 'Marshall');
	assert.is(marshall.age, 0);
	assert.is(marshall.fact, null);
  assert.is(marshall.cool, false);
});

properties('defaults should be overidden', () => {
	assert.is(macy.name, 'Macy');
	assert.is(macy.age, 21);
	assert.is(macy.fact, "Hey I'm super cool");
  assert.is(macy.cool, true);
});

properties('partial parameters should use some defaults', () => {
	assert.is(shaz.name, 'Shaz');
	assert.is(shaz.age, 444);
	assert.is(shaz.fact, null);
  assert.is(shaz.cool, false);
});

properties('values() should work', () => {
  assert.equal(marshall.values(),{
    name: "Marshall",
    age: 0,
    fact: null,
    cool: false
  })
  assert.equal(macy.values(),{
    age: 21,
    fact: "Hey I'm super cool",
    cool: true,
    name: "Macy"
  })
  assert.equal(shaz.values(),{
    age: 444,
    name: "Shaz",
    fact: null,
    cool: false
  })
});

properties('directly setting properties should work', () => {
  shaz.cool = true
  assert.is(shaz.cool, true)
  shaz.fact = "One Two"
  assert.is(shaz.fact, "One Two")
})

properties('set() should work', () => {
  marshall.set({ cool: true })
  assert.is(marshall.cool, true)
  marshall.set({ name: "MarshallCB", fact: "M#" })
  assert.is(marshall.name, "MarshallCB")
  assert.is(marshall.fact, "M#")
  assert.is(marshall.age, 0)
})

properties.run();

// var Profile = Context({
//   /**
//    * @desc The name of the name
//    */
//   name: "",
//   age: 0,
//   /**
//    * @desc increment age automatically
//    * @param 
//    * @return 
//    */
//   growUp(){
//     this.age += 1;
//   }
// })

// var List = (Item) => {
//   return Context({
//     items: {},
//     other: "",
//     set items(arr){
//       let items = {}
//       if(Array.isArray(arr)){
//         arr.forEach(x => {
//           items = { ...items,
//             [uid()]: Item(x)
//           }
//         })
//       } else {
//         items = arr;
//       }
//       return items;
//     },
//     add(params){
//       try{
//         let id = uid()
//         this.items = {...this.items,
//           [id]: params._isCtex ? params : Item(params)
//         }
//         return id;
//       } catch(e){
//         console.log(e)
//         return false;
//       }
//     },
//     get(id){
//       return items[id]
//     },
//     remove(id){
//       delete items[id]
//     }
//   })
// }


// let Team = List(Profile)

// let t = Team({
//   items: [
//     { name: "Macy" },
//     { name: "Marshall" }
//   ],
//   other: "test"
// })
// // console.log(t.values())
// t.set({
//   items: [
//     { name: "Macy" },
//     { name: "Marshall" }
//   ]
// })
// // console.log(t.values())
// // let p = Profile({ name: "Marshall" })
// // t.add(p)
// // t.add({ name: "Macy" })
// let is = new ContextNetwork({
//   team: t,
//   name: "Magic M's",
//   coach: Profile({
//     name: "Lahna",
//     age: 21
//   })
// })
// console.log(is('/coach'))
// console.log({...is('/team')})