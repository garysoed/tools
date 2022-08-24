import {assert, should, test} from 'gs-testing';

import {$asArray} from '../collect/operators/as-array';
import {$take} from '../collect/operators/take';
import {$pipe} from '../typescript/pipe';

import {aleaRandom} from './alea-random';
import {asRandom} from './random';

test('@tools/src/random2/alea-random', () => {
  should('produce the same sequence with the same seed', () => {
    const randomSequence = aleaRandom()
        .generate()
        .doBind(values => asRandom($pipe(values, $take(4), $asArray())));

    const values = randomSequence.run(123);
    assert(randomSequence.run(123)).to.haveExactElements(values);
  });
});
