import {assert, should, test} from 'gs-testing';

import {vector} from './vector';

test('@tools/src/collect/coordinates/vector', () => {
  test('add', () => {
    should('create the correct output for 2d vectors', () => {
      assert(vector.add([1, 2], [-3, 4])).to.equal([-2, 6]);
    });

    should('create the correct output for 3d vectors', () => {
      assert(vector.add([1, 2, 3], [-4, 5, 6])).to.equal([-3, 7, 9]);
    });
  });

  test('multiply', () => {
    should('create the correct output for 2d vectors', () => {
      assert(vector.multiply([1, 2], -3)).to.equal([-3, -6]);
    });

    should('create the correct output for 3d vectors', () => {
      assert(vector.multiply([1, 2, -3], -3)).to.equal([-3, -6, 9]);
    });
  });
});