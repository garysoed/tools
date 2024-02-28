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

  test('intersect', () => {
    should('return the correct intersection', () => {
      assert(vector.intersect([1, 2], [2, 4], [3, 4], [5, 8])).to.equal([
        -2, -4,
      ]);
    });

    should('return null if the vectors are parallel', () => {
      assert(vector.intersect([1, 2], [2, 4], [1, 2], [2, 4])).to.beNull();
    });
  });

  test('length', () => {
    should('return the correct length', () => {
      assert(vector.length([3, 4])).to.equal(5);
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

  test('scaleToLength', () => {
    should('scale the vector to the given length', () => {
      assert(vector.scaleToLength([6, 8], 5)).to.equal([3, 4]);
    });
  });
});
