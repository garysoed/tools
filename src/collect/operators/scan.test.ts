import {assert, should, test} from 'gs-testing';

import {$pipe} from '../../typescript/pipe';

import {$asArray} from './as-array';
import {$scan} from './scan';

test('@tools/collect/operators/scan', () => {
  should('yield accumulating results', () => {
    const result = $pipe(
      [1, 2, 3, 4, 5],
      $scan((acc, item) => `${item}` + `${acc}`, '2'),
      $asArray(),
    );

    assert(result).to.haveExactElements([
      '12',
      '212',
      '3212',
      '43212',
      '543212',
    ]);
  });
});
