import { Model } from '../dist';
import { Suite } from 'benchmark';

export function speed(){
  const bench = new Suite().on('cycle', e => {
    console.log('  ' + e.target);
  });

  bench.add('Model', () => {
    let example = Model({
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

  let example2 = Model({
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
  bench.add('Model Set', () => {
    example2({
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

