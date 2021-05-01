import {arrayThat, assert, should, test} from 'gs-testing';

import {$group} from './group';
import {$pipe} from './pipe';


test('@tools/collect/operators/group', () => {
  should('split the input into groups by their keys', () => {
    const source = [1, 1, 2, 3, 5, 8, 13];
    assert($pipe(source, $group(v => Math.floor(v / 2)))).to.haveExactElements(new Map([
      [0, arrayThat<number>().haveExactElements([1, 1])],
      [1, arrayThat<number>().haveExactElements([2, 3])],
      [2, arrayThat<number>().haveExactElements([5])],
      [4, arrayThat<number>().haveExactElements([8])],
      [6, arrayThat<number>().haveExactElements([13])],
    ]));
  });
});