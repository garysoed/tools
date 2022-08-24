import {assert, setup, should, test} from 'gs-testing';
import {numberType} from 'gs-types';

import {$join} from '../collect/operators/join';
import {$map} from '../collect/operators/map';
import {$take} from '../collect/operators/take';
import {$pipe} from '../typescript/pipe';

import {asRandom, newRandom} from './random';

test('@tools/src/random2/random', () => {
  const _ = setup(() => {
    const simpleRandom = newRandom(
        seed => {
          numberType.assert(seed);
          return [seed, seed + 1];
        },
        seed => {
          numberType.assert(seed);
          return seed * 10;
        },
    );
    return {simpleRandom};
  });

  should('be able to return a random value', () => {
    const value = _.simpleRandom.take(v => asRandom(`${v}`)).run(2);
    assert(value).to.equal('2');
  });

  should('be able to combine multiple random values', () => {
    const value = _.simpleRandom.take(a => {
      return _.simpleRandom.take(b => {
        return asRandom(`${a}${b}`);
      });
    })
        .run(3);

    assert(value).to.equal('34');
  });

  should('be able to return a random array with forking', () => {
    const value = _.simpleRandom.takeValues(values => {
      const before = $pipe(
          values,
          $map(v => `${v}`),
          $take(3),
          $join(','),
      );

      return _.simpleRandom.take(value => {
        return _.simpleRandom.takeValues(values => {
          const after = $pipe(
              values,
              $map(v => `${v}`),
              $take(3),
              $join(','),
          );

          return asRandom(`${before} ${value} ${after}`);
        });
      });
    })
        .run(4);
    assert(value).to.equal('40,41,42 5 60,61,62');
  });
});
