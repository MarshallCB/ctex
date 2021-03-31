import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {Model} from '../dist';

const models = suite('models');
/**
 * - Init function
 * - OR serialized symbols (requires too much magic)
 * - Hidden _variables
 * - Trigger symbol for arrays / objects?
 * - let { _logs, _zipped } = symbolize()
 */


var Person = Model({
  name: "",
  age: 0,
  birthday(){
    this.age++;
  },
  greeting(){
    return `Hello my name is ${this.name}`
  }
});

var CoolPerson = Model(
  Person,
  {
    greeting(){
      return `Yo! -${this.name}`
    }
  }
)

let marshall = CoolPerson({
  name: "Marshall",
  age: 21
})

models('Models should override', () => {
  assert.is("Yo! -Marshall", marshall.greeting())
});

models.run();
