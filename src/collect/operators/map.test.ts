import {assert, should, test} from 'gs-testing';

import {$pipe} from '../../typescript/pipe';

import {$map} from './map';

test('@tools/collect/map', () => {
  should('map the values according to the input function', () => {
    assert(
      $pipe(
        [1, 2, 3],
        $map((from) => `${from + 1}`),
      ),
    ).to.startWith(['2', '3', '4']);
  });
});
