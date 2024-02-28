import {
  arrayThat,
  assert,
  iterableThat,
  should,
  test,
  tupleThat,
} from 'gs-testing';

import {$pipe} from '../../typescript/pipe';

import {split} from './split';

test('@tools/collect/split', () => {
  should('return tuple that splits at the correct position', () => {
    const inf = function* (): Generator<number> {
      let i = 0;
      while (true) {
        yield i;
        i++;
      }
    };

    assert($pipe(inf(), split(5))).to.equal(
      tupleThat<[readonly number[], Iterable<number>]>().haveExactElements([
        arrayThat<number>().haveExactElements([0, 1, 2, 3, 4]),
        iterableThat<number, Iterable<number>>().startWith([5, 6, 7, 8, 9]),
      ]),
    );
  });

  should(
    'return tuple with empty array in first element if count is zero',
    () => {
      const inf = function* (): Generator<number> {
        let i = 0;
        while (true) {
          yield i;
          i++;
        }
      };

      assert($pipe(inf(), split(0))).to.equal(
        tupleThat<[readonly number[], Iterable<number>]>().haveExactElements([
          arrayThat<number>().beEmpty(),
          iterableThat<number, Iterable<number>>().startWith([0, 1, 2, 3, 4]),
        ]),
      );
    },
  );

  should(
    'return tuple with all elements in the first element if count is too big',
    () => {
      assert($pipe([1, 2, 3], split(5))).to.equal(
        tupleThat<[readonly number[], Iterable<number>]>().haveExactElements([
          arrayThat<number>().haveExactElements([1, 2, 3]),
          iterableThat<number, Iterable<number>>().beEmpty(),
        ]),
      );
    },
  );

  should('return tuple with empty array if count is negative', () => {
    const inf = function* (): Generator<number> {
      let i = 0;
      while (true) {
        yield i;
        i++;
      }
    };

    assert($pipe(inf(), split(-5))).to.equal(
      tupleThat<[readonly number[], Iterable<number>]>().haveExactElements([
        arrayThat<number>().beEmpty(),
        iterableThat<number, Iterable<number>>().startWith([0, 1, 2, 3, 4]),
      ]),
    );
  });
});
