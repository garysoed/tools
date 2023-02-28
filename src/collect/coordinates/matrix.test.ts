import {assert, should, test} from 'gs-testing';

import {matrix} from './matrix';

test('@tools/src/collect/coordinates/matrix', () => {
  test('determinant', () => {
    should('return the correct determinant', () => {
      assert(matrix.determinant([[1, 2], [3, 4]])).to.equal(-2);
    });
  });

  test('inverse', () => {
    should('return the correct inverse', () => {
      assert(matrix.inverse([[4, 11], [2, 6]])).to.equal([[3, -5.5], [-1, 2]]);
    });

    should('return null if not invertible', () => {
      assert(matrix.inverse([[4, 8], [3, 6]])).to.beNull();
    });
  });

  test('multiply', () => {
    should('return the correct result', () => {
      assert(matrix.multiply([[1, 3], [5, 7]], 2)).to.equal([[2, 6], [10, 14]]);
    });
  });
});