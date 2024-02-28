import {arrayThat, assert, should, test} from 'gs-testing';

import {$pipe} from '../../typescript/pipe';
import {countableIterable} from '../structures/countable-iterable';

import {$asArray} from './as-array';
import {$buffer} from './buffer';

test('@tools/src/collect/operators/buffer', () => {
  should('group the iterables into buffer sized arrays', () => {
    assert($pipe(countableIterable(), $buffer(3))).to.startWith([
      arrayThat<number>().haveExactElements([0, 1, 2]),
      arrayThat<number>().haveExactElements([3, 4, 5]),
      arrayThat<number>().haveExactElements([6, 7, 8]),
    ]);
  });

  should('not yield the array with smaller size than the buffer', () => {
    assert($pipe([1, 2, 3, 4, 5], $buffer(3), $asArray())).to.equal([
      [1, 2, 3],
    ]);
  });
});
