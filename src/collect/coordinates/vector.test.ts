import {assert, should, test} from 'gs-testing';

import {vector} from './vector';

test('@tools/src/collect/coordinates/vector', () => {
  test('add', () => {
    should('create the correct output for 2d vectors', () => {
      assert(vector.add([1, 2], [-3, 4])).to.haveExactElements([-2, 6]);
    });

    should('create the correct output for 3d vectors', () => {
      assert(vector.add([1, 2, 3], [-4, 5, 6])).to.haveExactElements([-3, 7, 9]);
    });
  });
});