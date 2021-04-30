import {assert, should, test} from 'gs-testing';

import {$first} from '../../collect/operators/first';
import {$pipe} from '../../collect/operators/pipe';
import {fromSeed} from '../random';
import {FakeSeed} from '../testing/fake-seed';

import {$pickItemByFraction} from './pick-item-by-fraction';


test('@tools/random/operators/pick-item-by-fraction', () => {
  should('return the correct member of the list', () => {
    const rng = fromSeed(new FakeSeed([0.6]));

    assert($pipe(rng, $pickItemByFraction(['a', 'b', 'c', 'd', 'e']), $first())).to.equal('d');
  });
});
