import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {Model} from '../dist';

const iteration = suite('iteration');

var Blood = Model({
  type: "O",
  sugar: 0,
  eat(){
    this.sugar++;
  },
  exercise(){
    this.sugar--;
  }
})

var Person = Model({
  name: "Marshall",
  age: 0,
  birthday(){
    this.age++;
  },
  blood: Blood
});

let marshall = Person()

iteration('Keys should not include methods', () => {
  const keys = Object.keys(marshall)
  assert.is(keys.length, 3)
});

iteration('Keys should match property names', () => {
  const keys = Object.keys(marshall)
  assert.is(true, keys.includes('age') && keys.includes('name'))
});

iteration('For..in should work', () => {
  const expected = ["name","age","blood"]
  let i = 0
  for (const key in marshall) {
    assert.is(key, expected[i])
    i++
  }
})
iteration.run();
