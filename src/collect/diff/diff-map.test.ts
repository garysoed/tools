import {assert, should, test} from 'gs-testing';

import {diffMap, undiffMap} from './diff-map';


test('@tools/src/collect/diff/map-diff', () => {
  test('diff', () => {
    should('return the correct diffs', () => {
      const diffs = diffMap(
          new Map([['a', 1], ['b', 2], ['c', 3]]),
          new Map([['b', 6], ['c', 3], ['d', 4]]),
      );

      assert(diffs).to.equal([
        {type: 'delete', key: 'a'},
        {type: 'set', key: 'b', value: 6},
        {type: 'set', key: 'd', value: 4},
      ]);
    });

    should('compare using the given function', () => {
      const diffs = diffMap(
          new Map([['a', {id: 1}], ['b', {id: 2}], ['c', {id: 3}]]),
          new Map([['b', {id: 6}], ['c', {id: 3}], ['d', {id: 4}]]),
          (a, b) => a.id === b.id,
      );

      assert(diffs).to.equal([
        {type: 'delete', key: 'a'},
        {type: 'set', key: 'b', value: {id: 6}},
        {type: 'set', key: 'd', value: {id: 4}},
      ]);
    });
  });

  test('undiffMap', () => {
    should('return the correct map', () => {
      const result = undiffMap(
          new Map([['a', 1], ['b', 2], ['c', 3]]),
          [
            {type: 'delete', key: 'a'},
            {type: 'set', key: 'b', value: 6},
            {type: 'set', key: 'd', value: 4},
          ],
      );

      assert(result).to.haveExactElements(new Map([['b', 6], ['c', 3], ['d', 4]]));
    });
  });
});
