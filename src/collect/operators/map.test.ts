import { assert, should, test } from '@gs-testing';

import { $ } from './chain';
import { map } from './map';

test('@tools/collect/map', () => {
  should(`map the values according to the input function`, () => {
    assert($(new Set([1, 2, 3]), map(from => `${from + 1}`))).to.haveElements(['2', '3', '4']);
  });
});