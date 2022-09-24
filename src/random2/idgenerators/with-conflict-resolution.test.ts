import {assert, setup, should, test} from 'gs-testing';
import {numberType} from 'gs-types';

import {$asArray} from '../../collect/operators/as-array';
import {$map} from '../../collect/operators/map';
import {$take} from '../../collect/operators/take';
import {countableIterable} from '../../collect/structures/countable-iterable';
import {$pipe} from '../../typescript/pipe';
import {asRandom, newRandom} from '../random';

import {withConflictResolution} from './with-conflict-resolution';

test('@tools/src/random2/idgenerators/with-conflict-resolution', () => {
  const _ = setup(() => {
    const randomId = newRandom<string>(
        seed => {
          numberType.assert(seed);
          const suffixes = $pipe(
              countableIterable(),
              $take(seed),
              $map(seed => `${seed}`),
              $asArray(),
          );
          const segments = ['g', ...suffixes];
          return [segments.join('-'), seed + 1];
        },
        seed => seed,
    );

    return {randomId};
  });

  should('resolve conflicts repeatedly', () => {
    const resolved = withConflictResolution(_.randomId);

    assert(resolved.takeValues(values => asRandom($pipe(values, $take(3), $asArray()))).run(0)).to
        .haveExactElements([
          'g',
          'g-0',
          'g-0-1',
        ]);
  });

  should('not resolve the same conflicts when ran multiple times', () => {
    const resolved = withConflictResolution(_.randomId);
    const randomTriplet = resolved.takeValues(values => asRandom($pipe(values, $take(3), $asArray())));

    assert(randomTriplet.run(0)).to .haveExactElements(['g', 'g-0', 'g-0-1']);
    assert(randomTriplet.run(0)).to .haveExactElements(['g', 'g-0', 'g-0-1']);
  });
});