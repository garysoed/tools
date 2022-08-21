import {assert, should, test} from 'gs-testing';

import {$asArray} from '../collect/operators/as-array';
import {$take} from '../collect/operators/take';
import {$pipe} from '../typescript/pipe';

import {aleaSeed} from './alea-seed';
import {randomGen} from './random-gen';


test('@tools/random-next/alea-seed', () => {
  should('produce the same sequence with the same seed', () => {
    const seed = 123;
    const sequence1 = $pipe(randomGen(aleaSeed(seed)), $take(5), $asArray());
    const sequence2 = $pipe(randomGen(aleaSeed(seed)), $take(5), $asArray());
    assert(sequence1).to.haveExactElements(sequence2);
  });
});