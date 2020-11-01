import { assert, should, test } from 'gs-testing';

import { CompareResult } from './compare-result';
import { compound } from './compound';
import { normal } from './normal';


test('@tools/collect/compare/compound', () => {
  should('use the first ordering and use the subsequent ones for tie breaking', () => {
    const ordering = compound([
      () => 0 as CompareResult,
      normal<number>(),
    ]);
    assert(ordering(0, 1)).to.equal(-1);
    assert(ordering(1, 0)).to.equal(1);
  });

  should('return 0 if none of the given orderings can break ties', () => {
    const ordering = compound([
      () => 0 as CompareResult,
    ]);
    assert(ordering(0, 1)).to.equal(0);
  });
});
