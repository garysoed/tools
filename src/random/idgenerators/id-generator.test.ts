import {assert, setup, should, test} from 'gs-testing';
import {numberType} from 'gs-types';

import {$asArray} from '../../collect/operators/as-array';
import {$map} from '../../collect/operators/map';
import {$take} from '../../collect/operators/take';
import {countableIterable} from '../../collect/structures/countable-iterable';
import {$pipe} from '../../typescript/pipe';
import {asRandom, newRandom} from '../random';

import {idGenerator} from './id-generator';

test('@tools/src/random/idgenerators/id-generator', () => {
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
    const values = idGenerator(_.randomId.takeValues(values => asRandom(values)).run(0));

    assert($pipe(values, $take(3), $asArray())).to
        .haveExactElements(['g', 'g-0', 'g-0-1']);
  });

  should('not resolve the same conflicts when ran multiple times', () => {
    const values1 = idGenerator(_.randomId.takeValues(values => asRandom(values)).run(0));
    const values2 = idGenerator(_.randomId.takeValues(values => asRandom(values)).run(0));

    assert($pipe(values1, $take(3), $asArray())).to.haveExactElements(['g', 'g-0', 'g-0-1']);
    assert($pipe(values2, $take(3), $asArray())).to.haveExactElements(['g', 'g-0', 'g-0-1']);
  });
});