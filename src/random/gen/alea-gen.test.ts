import {assert, should, test} from 'gs-testing';

import {$asArray} from '../../collect/operators/as-array';
import {$map} from '../../collect/operators/map';
import {$take} from '../../collect/operators/take';
import {countableIterable} from '../../collect/structures/countable-iterable';
import {$pipe} from '../../typescript/pipe';
import {fromSeed} from '../random';

import {aleaSeed} from './alea-gen';


test('@tools/random/gen/alea-gen', () => {
  should('produce the same sequence with the same seed', () => {
    const seed = 123;
    const sequence1 = $pipe(
        countableIterable(),
        $take(5),
        $map(() => fromSeed(aleaSeed(seed)).next()),
        $asArray(),
    );
    const sequence2 = $pipe(
        countableIterable(),
        $take(5),
        $map(() => fromSeed(aleaSeed(seed)).next()),
        $asArray(),
    );
    assert(sequence1).to.haveExactElements(sequence2);
  });
});