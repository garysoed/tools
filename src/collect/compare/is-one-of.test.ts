import { assert, should, test } from '@gs-testing';
import {isOneOf} from './is-one-of';

test('@tools/collect/compare/is-one-of', () => {
  should(`order matching items at the start of the list`, () => {
    const list = [1, 2, 3];
    list.sort(isOneOf([3]));

    assert(list).to.haveExactElements([3, 1, 2]);
  });
});