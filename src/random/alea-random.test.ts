import {assert, should, test} from 'gs-testing';

import {$asArray} from '../collect/operators/as-array';
import {$take} from '../collect/operators/take';
import {$pipe} from '../typescript/pipe';

import {aleaRandom} from './alea-random';
import {asRandom} from './random';

test('@tools/src/random/alea-random', () => {
  should('produce the same sequence with the same seed', () => {
    const seed = 123;
    const randomSequence = aleaRandom()
        .takeValues(values => asRandom($pipe(values, $take(4), $asArray())));

    const values = randomSequence.run(seed);
    assert(randomSequence.run(seed)).to.haveExactElements(values);
  });

  should('produce different sequences with multiple generates', () => {
    const random = aleaRandom();
    const {sequence1, sequence2} = random
        .takeValues(values => {
          const sequence1 = $pipe(values, $take(4), $asArray());
          return random.takeValues(values => {
            const sequence2 = $pipe(values, $take(4), $asArray());
            return asRandom({sequence1, sequence2});
          });
        })
        .run(123);

    assert(sequence1).toNot.haveExactElements(sequence2);
  });
});
