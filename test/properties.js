import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {Model} from '../dist';

  const properties = suite('properties');
  
  var Person = Model({
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
  
  properties('context function should return values', () => {
    assert.equal(marshall,{
      name: "Marshall",
      age: 0,
      fact: null,
      cool: false
    })
    assert.equal(macy,{
      age: 21,
      fact: "Hey I'm super cool",
      cool: true,
      name: "Macy"
    })
    assert.equal(shaz,{
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
  
  properties('setting with context function should work', () => {
    Object.assign(marshall,{ cool: true })
    assert.is(marshall.cool, true)
    Object.assign(marshall,{ name: "MarshallCB", fact: "M#" })
    assert.is(marshall.name, "MarshallCB")
    assert.is(marshall.fact, "M#")
    assert.is(marshall.age, 0)
  })
  
  properties.run();
