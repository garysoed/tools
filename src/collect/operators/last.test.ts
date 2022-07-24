import {assert, should, test} from 'gs-testing';

import {$pipe} from '../../typescript/pipe';
import {countableIterable} from '../structures/countable-iterable';

import {$last} from './last';


test('@tools/collect/operators/last', () => {
  should('return the last element', () => {
    assert($pipe([1, 2, 3, 4, 5], $last())).to.equal(5);
  });

  should('return the element at the max index if max items is given', () => {
    assert($pipe(countableIterable(), $last(6))).to.equal(5);
  });
});