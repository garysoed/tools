import {assert, setup, should, test} from 'gs-testing';

import {cartesian} from '../collect/coordinates/cartesian';
import {Vector2} from '../collect/coordinates/vector';

import {aleaRandom} from './alea-random';
import {randomBfsCluster} from './random-bfs-cluster';

test('@tools/src/random/random-bfs-cluster', () => {
  const _ = setup(() => {
    const seed = aleaRandom();
    const candidates: Vector2[] = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 8; y++) {
        candidates.push([x, y]);
      }
    }
    return {candidates, seed};
  });

  should('randomly generate a cluster', () => {
    const size = {min: 8, max: 12};
    const result = randomBfsCluster(
      [1, 6],
      {candidates: _.candidates, size, coordinate: cartesian},
      _.seed,
    ).run(12);
    assert(result.length >= 8).to.beTrue();
    assert(result.length <= 12).to.beTrue();
  });

  should('return the starting position if size is 1', () => {
    const startingPosition: Vector2 = [1, 6];
    const size = {min: 1, max: 1};
    const result = randomBfsCluster(
      startingPosition,
      {candidates: _.candidates, size, coordinate: cartesian},
      _.seed,
    ).run(12);
    assert(result).to.equal([startingPosition]);
  });
});
