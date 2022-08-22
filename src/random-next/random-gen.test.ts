import {assert, should, test} from 'gs-testing';

import {$asArray} from '../collect/operators/as-array';
import {$take} from '../collect/operators/take';
import {$pipe} from '../typescript/pipe';

import {randomGen} from './random-gen';
import {RandomSeed} from './random-seed';

class TestSeed implements RandomSeed {
  constructor(private start: number) { }

  fork(): RandomSeed {
    return new TestSeed(this.start * 10);
  }

  next(): number {
    return this.start++;
  }
}

test('@tools/src/random-next/random-gen', () => {
  test('values', () => {
    should('generate the values that continues through several iterations', () => {
      const gen = randomGen(new TestSeed(1));
      assert(gen).to.startWith([1, 2, 3, 4, 5]);
      assert(gen).to.startWith([6, 7, 8, 9, 10]);
    });

    should('generate predictable values', () => {
      const gen1 = randomGen(new TestSeed(1));
      const gen2 = randomGen(new TestSeed(1));

      const values1 = $pipe(gen1, $take(5), $asArray());
      const values2 = $pipe(gen2, $take(5), $asArray());
      assert(values2).to.haveExactElements(values1);
    });
  });

  test('map', () => {
    should('create RandomGen that does not get affected by when it is created wrt to calling next',
        () => {
          const gen = randomGen(new TestSeed(1));
          const gen2 = gen.map(value => `${value}`);
          const gen3 = gen.map(value => `${value}`);

          assert(gen).to.startWith([1, 2, 3, 4, 5]);
          assert(gen2).to.startWith(['10', '11', '12', '13', '14']);
          assert(gen3).to.startWith(['100', '101', '102', '103', '104']);
        });

    should('create a second RandomGen which is independent from the origin\'s values', () => {
      const gen = randomGen(new TestSeed(1));
      assert(gen).to.startWith([1, 2, 3]);

      const gen2 = gen.map(value => `${value}`);
      assert(gen2).to.startWith(['10', '11', '12', '13', '14']);
      assert(gen).to.startWith([4, 5, 6, 7, 8]);
      assert(gen2).to.startWith(['15', '16', '17', '18', '19']);
    });
  });
});
