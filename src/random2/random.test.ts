import {assert, setup, should, test} from 'gs-testing';
import {numberType} from 'gs-types';

import {$join} from '../collect/operators/join';
import {$map} from '../collect/operators/map';
import {$take} from '../collect/operators/take';
import {$pipe} from '../typescript/pipe';

import {asRandom, newRandom} from './random';

test('@tools/src/random2/random', () => {
  const _ = setup(() => {
    const simpleRandom = newRandom(seed => {
      numberType.assert(seed);
      return [seed, seed + 1];
    });
    return {simpleRandom};
  });

  should('be able to return a random value', () => {
    const value = _.simpleRandom.doBind(v => asRandom(`${v}`)).run(2);
    assert(value).to.equal('2');
  });

  should('be able to combine multiple random values', () => {
    const value = _.simpleRandom.doBind(a => {
      return _.simpleRandom.doBind(b => {
        return asRandom(`${a}${b}`);
      });
    })
        .run(3);

    assert(value).to.equal('34');
  });

  should('be able to return a random array', () => {
    const value = _.simpleRandom.generate().doBind(values => asRandom($pipe(
        values,
        $map(v => `${v}`),
        $take(5),
        $join(''),
    )))
        .run(4);
    assert(value).to.equal('45678');
  });
});
