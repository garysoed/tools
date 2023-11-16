import {assert, should, test} from 'gs-testing';

import {cartesian} from '../collect/coordinates/cartesian';
import {Grid} from '../collect/structures/grid';

import {randomDfsCluster} from './random-dfs-cluster';
import {incrementingRandom} from './testing/incrementing-random';

test('@tools/src/random/random-dfs-cluster', () => {
  should('randomly generate a cluster', () => {
    const seed = incrementingRandom(7);
    const candidates = new Grid<{}>();
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 8; y++) {
        candidates.set([x, y], {});
      }
    }
    const size = {min: 8, max: 12};
    const result = randomDfsCluster({candidates, size, coordinate: cartesian}, seed).run(12);
    assert(result).to.equal([
      [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [4, 6], [5, 6], [6, 6], [7, 6],
    ]);
  });
});