import { assert, objectThat, run, should, test } from 'gs-testing';

import { ArrayDiff } from './array-observable';
import { diff } from './diff-array';

test('@tools/rxjs/state/diff-array', () => {
  test('diff', () => {
    should(`return the correct diffs`, () => {
      const result = diff([2, 4, 7], [2, 3, 4, 5, 6]);
      assert(result).to.haveExactElements([
        objectThat<ArrayDiff<number>>().haveProperties({type: 'insert', index: 1, value: 3}),
        objectThat<ArrayDiff<number>>().haveProperties({type: 'insert', index: 3, value: 5}),
        objectThat<ArrayDiff<number>>().haveProperties({type: 'insert', index: 4, value: 6}),
        objectThat<ArrayDiff<number>>().haveProperties({type: 'delete', index: 5, value: 7}),
      ]);
    });
  });
});

