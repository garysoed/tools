import {assert, createSmartMatcher, should, test} from 'gs-testing';

import {diffArray, undiffArray} from './diff-array';


test('@tools/src/collect/diff/diff-array', () => {
  test('diffArray', () => {
    should('return the correct diffs', () => {
      const diffs = diffArray(
          [2, 4, 7],
          [2, 3, 4, 5, 6],
      );

      assert(diffs).to.equal(createSmartMatcher([
        {type: 'insert', index: 1, value: 3},
        {type: 'insert', index: 3, value: 5},
        {type: 'insert', index: 4, value: 6},
        {type: 'delete', index: 5, value: 7},
      ]));
    });

    should('compare using the given function', () => {
      const diffs = diffArray(
          [{id: 2}, {id: 4}, {id: 7}],
          [{id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}],
          (a, b) => a.id === b.id,
      );

      assert(diffs).to.equal(createSmartMatcher([
        {type: 'insert', index: 1, value: {id: 3}},
        {type: 'insert', index: 3, value: {id: 5}},
        {type: 'insert', index: 4, value: {id: 6}},
        {type: 'delete', index: 5, value: {id: 7}},
      ]));
    });
  });

  test('undiffArray', () => {
    should('return the correct array', () => {
      const result = undiffArray(
          [2, 4, 7],
          [
            {type: 'insert', index: 1, value: 3},
            {type: 'insert', index: 3, value: 5},
            {type: 'insert', index: 4, value: 6},
            {type: 'delete', index: 5, value: 7},
          ],
      );
      assert(result).to.haveExactElements([2, 3, 4, 5, 6]);
    });
  });
});

