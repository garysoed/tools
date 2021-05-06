import {assert, should, test} from 'gs-testing';

import {$asArray} from './as-array';
import {$pipe} from './pipe';
import {$scan} from './scan';


test('@tools/collect/operators/scan', () => {
  should('yield accumulating results', () => {
    const result = $pipe(
        [1, 2, 3, 4, 5],
        $scan((item, acc) => item + acc, 2),
        $asArray(),
    );

    assert(result).to.haveExactElements([3, 5, 8, 12, 17]);
  });
});