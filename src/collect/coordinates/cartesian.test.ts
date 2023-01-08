import {arrayThat, assert, should, test, tupleThat} from 'gs-testing';

import {cartesian} from './cartesian';

test('@tools/src/collect/coordinates/cartesian', () => {
  test('axes', () => {
    should('create correct vectors when dimension is 2', () => {
      assert(cartesian.axes(2)).to.haveExactElements([
        tupleThat<[number, number]>().haveExactElements([1, 0]),
        tupleThat<[number, number]>().haveExactElements([0, 1]),
      ]);
    });

    should('create correct vectors when dimension is 3', () => {
      assert(cartesian.axes(3)).to.haveExactElements([
        arrayThat<number>().haveExactElements([1, 0, 0]),
        arrayThat<number>().haveExactElements([0, 1, 0]),
        arrayThat<number>().haveExactElements([0, 0, 1]),
      ]);
    });
  });

  test('directions', () => {
    should('create correct vectors when dimension is 2', () => {
      assert(cartesian.directions(2)).to.haveExactElements([
        tupleThat<[number, number]>().haveExactElements([1, 0]),
        tupleThat<[number, number]>().haveExactElements([-1, 0]),
        tupleThat<[number, number]>().haveExactElements([0, 1]),
        tupleThat<[number, number]>().haveExactElements([0, -1]),
      ]);
    });

    should('create correct vectors when dimension is 3', () => {
      assert(cartesian.directions(3)).to.haveExactElements([
        arrayThat<number>().haveExactElements([1, 0, 0]),
        arrayThat<number>().haveExactElements([-1, 0, 0]),
        arrayThat<number>().haveExactElements([0, 1, 0]),
        arrayThat<number>().haveExactElements([0, -1, 0]),
        arrayThat<number>().haveExactElements([0, 0, 1]),
        arrayThat<number>().haveExactElements([0, 0, -1]),
      ]);
    });
  });
});