import {assert, should, test} from 'gs-testing';

import {cartesian} from '../collect/coordinates/cartesian';
import {Grid} from '../collect/structures/grid';

import {randomBfsCluster} from './random-bfs-cluster';
import {incrementingRandom} from './testing/incrementing-random';

test('@tools/src/random/random-bfs-cluster', () => {
  should('randomly generate a cluster', () => {
    const seed = incrementingRandom(7);
    const candidates = new Grid<{}>();
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 8; y++) {
        candidates.set([x, y], {});
      }
    }
    const size = {min: 8, max: 12};
    const result = randomBfsCluster({candidates, size, coordinate: cartesian}, seed).run(12);
    assert(result).to.equal([[1, 6], [2, 6], [3, 6], [2, 7], [0, 7], [1, 7]]);
  });
});