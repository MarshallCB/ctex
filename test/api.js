import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {Model, CTEX, Context} from '../dist';

  const API = suite('exports');
  
  API('Model should return a function', () => {
    assert.type(Model({}), 'function');
  });
  
  API('Model should have Model symbol', () => {
    assert.is(Model({})[CTEX.MODEL], true);
  });
  
  API('Context should have Context symbol', () => {
    assert.is(Model({})()[CTEX.CONTEXT], true);
    assert.is(Context({})[CTEX.CONTEXT], true);
  });
  
  API.run();

