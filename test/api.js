import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {Model} from '../dist';

  const API = suite('exports');
  
  API('should export an function', () => {
    assert.type(Model, 'function');
  });
  
  API('should return a function', () => {
    assert.type(Model({}), 'function');
  });
  
  API('uninvoked definition should have _isCtex', () => {
    assert.is(Model({})._isCtex, true);
  });
  
  API('invoked definition should have _isCtex', () => {
    assert.is(Model({})()._isCtex, true);
  });
  
  API.run();

