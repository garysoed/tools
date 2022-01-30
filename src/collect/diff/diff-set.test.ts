import {assert, createSmartMatcher, should, test} from 'gs-testing';

import {diffSet, undiffSet} from './diff-set';


test('@tools/src/collect/diff/set-diff', () => {
  test('diff', () => {
    should('return the correct diffs', () => {
      const diffs = diffSet(new Set([1, 2, 3]), new Set([3, 2, 4]));

      assert(diffs).to.equal(createSmartMatcher([
        {type: 'delete', value: 1},
        {type: 'add', value: 4},
      ]));
    });
  });

  test('undiffSet', () => {
    should('return the correct set', () => {
      const result = undiffSet(
          new Set([1, 2, 3]),
          [
            {type: 'delete', value: 1},
            {type: 'add', value: 4},
          ],
      );

      assert(result).to.haveExactElements(new Set([3, 2, 4]));
    });
  });
});
