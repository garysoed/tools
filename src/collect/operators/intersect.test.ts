import { assert, should, test } from 'gs-testing';

import { $pipe } from './pipe';
import { intersect } from './intersect';

test('@tools/collect/intersect', () => {
  test('intersect', () => {
    should('create a set containing common entries', () => {
      assert($pipe(new Set([1, 2, 3]), intersect(new Set([2, 3, 4]))))
          .to.haveExactElements(new Set([2, 3]));
    });
  });
});
