import {assert, should, test} from 'gs-testing';

import {diffArray, undiffArray} from './diff-array';

test('@tools/src/collect/diff/diff-array', () => {
  test('diffArray', () => {
    should('return the correct diffs', () => {
      const diffs = diffArray([2, 4, 7], [2, 3, 4, 5, 6]);

      assert(diffs).to.equal([
        {index: 1, type: 'insert', value: 3},
        {index: 3, type: 'insert', value: 5},
        {index: 4, type: 'insert', value: 6},
        {index: 5, type: 'delete', value: 7},
      ]);
    });

    should('compare using the given function', () => {
      const diffs = diffArray(
        [{id: 2}, {id: 4}, {id: 7}],
        [{id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}],
        (a, b) => a.id === b.id,
      );

      assert(diffs).to.equal([
        {index: 1, type: 'insert', value: {id: 3}},
        {index: 3, type: 'insert', value: {id: 5}},
        {index: 4, type: 'insert', value: {id: 6}},
        {index: 5, type: 'delete', value: {id: 7}},
      ]);
    });
  });

  test('undiffArray', () => {
    should('return the correct array', () => {
      const result = undiffArray(
        [2, 4, 7],
        [
          {index: 1, type: 'insert', value: 3},
          {index: 3, type: 'insert', value: 5},
          {index: 4, type: 'insert', value: 6},
          {index: 5, type: 'delete', value: 7},
        ],
      );
      assert(result).to.haveExactElements([2, 3, 4, 5, 6]);
    });
  });
});
