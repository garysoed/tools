import {arrayThat, assert, should, test, tupleThat} from 'gs-testing';

import {hex} from './hex';

test('@tools/src/collect/coordinates/hex', () => {
  test('directions', () => {
    should('create correct vectors when dimension is 2', () => {
      assert(hex.directions(2)).to.haveExactElements([
        tupleThat<[number, number]>().haveExactElements([1, 0]),
        tupleThat<[number, number]>().haveExactElements([0, 1]),
        tupleThat<[number, number]>().haveExactElements([1, 1]),
      ]);
    });

    should('create correct vectors when dimension is 3', () => {
      assert(hex.directions(3)).to.haveExactElements([
        arrayThat<number>().haveExactElements([1, 0, 0]),
        arrayThat<number>().haveExactElements([0, 1, 0]),
        arrayThat<number>().haveExactElements([0, 0, 1]),
        arrayThat<number>().haveExactElements([1, 1, 0]),
        arrayThat<number>().haveExactElements([1, 0, 1]),
        arrayThat<number>().haveExactElements([0, 1, 1]),
      ]);
    });
  });
});