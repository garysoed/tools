import {assert, should, test} from 'gs-testing';

import {asArray} from '../../collect/operators/as-array';
import {$pipe} from '../../collect/operators/pipe';
import {take} from '../../collect/operators/take';
import {fromSeed} from '../random';

import {aleaSeed} from './alea-seed';


test('@tools/random/alea-rng', () => {
  should('produce the same sequence with the same seed', () => {
    const seed = 123;
    const sequence1 = $pipe(fromSeed(aleaSeed(seed)).iterable(), take(5), asArray());
    const sequence2 = $pipe(fromSeed(aleaSeed(seed)).iterable(), take(5), asArray());
    assert(sequence1).to.haveExactElements(sequence2);
  });
});
