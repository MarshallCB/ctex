import { Context, Network } from '../dist';
import { Suite } from 'benchmark';

export function speed(){
  console.log('\Object creation:');
  const bench = new Suite().on('cycle', e => {
    console.log('  ' + e.target);
  });

  bench.add('Context', () => {
    let example = Context({
      name: "Marshall",
      age: 12,
      stuff: {
        facts: "Yeah",
        hello: "World"
      }
    })
  })

  bench.add('Object', () => {
    let example = {
      name: "Marshall",
      age: 12,
      stuff: {
        facts: "Yeah",
        hello: "World"
      }
    }
  })

  let example2 = Context({
    name: "Marshall",
    age: 12,
    stuff: {
      facts: "Yeah",
      hello: "World"
    }
  })()
  let example3 = {
    name: "Marshall",
    age: 12,
    stuff: {
      facts: "Yeah",
      hello: "World"
    }
  }
  console.log('\Object setting:');
  bench.add('Context Set', () => {
    example2.set({
      name: "Mark",
      age: 53,
      stuff: {
        factoid: "ooh",
        hi: "Earth"
      }
    })
  })

  bench.add('Object Set', () => {
    example3 = {
      name: "Marshall",
      age: 12,
      stuff: {
        facts: "Yeah",
        hello: "World"
      }
    }
  })

  bench.run();
}

