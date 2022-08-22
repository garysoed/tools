import {assert, setup, should, test} from 'gs-testing';

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
  const _ = setup(() => {
    const testSeed = new TestSeed(1);

    return {testSeed};
  });

  test('values', () => {
    should('generate the values correctly', () => {
      const gen = randomGen(_.testSeed);
      assert(gen).to.startWith([1, 2, 3, 4, 5]);
      assert(gen).to.startWith([6, 7, 8, 9, 10]);
    });
  });

  test('map', () => {
    should('create a second RandomGen with forked seed', () => {
      const gen = randomGen(_.testSeed);
      const gen2 = gen.map(value => `${value}`);

      assert(gen).to.startWith([1, 2, 3, 4, 5]);
      assert(gen2).to.startWith(['10', '11', '12', '13', '14']);
    });

    should('create a second RandomGen which depends on the seed\'s value', () => {
      const gen = randomGen(_.testSeed);
      assert(gen).to.startWith([1, 2, 3]);

      const gen2 = gen.map(value => `${value}`);
      assert(gen2).to.startWith(['40', '41', '42', '43', '44']);
      assert(gen).to.startWith([4, 5, 6, 7, 8]);
    });
  });
});
