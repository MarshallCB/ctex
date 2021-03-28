import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {Context} from '../dist';

const Sub = suite('subscriptions');

const createCTX = () => Context({
  x: 0,
  y: 0,
  diagonal(amount=0){
    this.x += amount;
    this.y += amount;
  }
})

Sub('Root Subscription should fire on property change', () => new Promise((res,rej) => {
  let ctx = createCTX()
  ctx.$(({ x, y }) => {
    assert.is(x,4);
    res()
  })
  ctx.x = 4;
}));

Sub('Root Subscription should fire once on bulk load', () => new Promise((res,rej) => {
  let ctx = createCTX()
  ctx.$(({ x, y }) => {
    assert.is(x, 2)
    assert.is(y, 3)
    res()
  })
  Object.assign(ctx,{x:2,y:3})
}));

Sub('Property Subscription should fire on property change', () => new Promise((res,rej) => {
  let ctx = createCTX()
  ctx.$.x(x => {
    assert.is(x, 5)
    res()
  })
  Object.assign(ctx,{x:5})
}));

Sub('Property Subscription should fire once on bulk load', () => new Promise((res,rej) => {
  let ctx = createCTX()
  ctx.$.y(y => {
    assert.is(y, 6)
    res()
  })
  Object.assign(ctx,{x: 7,y: 6})
}));

Sub.run();

