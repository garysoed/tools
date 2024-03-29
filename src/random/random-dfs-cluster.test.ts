import {assert, setup, should, test} from 'gs-testing';

import {cartesian} from '../collect/coordinates/cartesian';
import {Vector2} from '../collect/coordinates/vector';
import {Grid} from '../collect/structures/grid';

import {aleaRandom} from './alea-random';
import {randomDfsCluster} from './random-dfs-cluster';

test('@tools/src/random/random-dfs-cluster', () => {
  const _ = setup(() => {
    const seed = aleaRandom();
    const candidates = new Grid<{}>();
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 8; y++) {
        candidates.set([x, y], {});
      }
    }
    return {candidates, seed};
  });

  should('randomly generate a cluster', () => {
    const seed = aleaRandom();
    const candidates = new Grid<{}>();
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 8; y++) {
        candidates.set([x, y], {});
      }
    }
    const size = {min: 8, max: 12};
    const result = randomDfsCluster(
      [1, 6],
      {candidates, size, coordinate: cartesian},
      seed,
    ).run(12);
    assert(result.length >= 8).to.beTrue();
    assert(result.length <= 12).to.beTrue();
  });

  should('return the starting position if size is 1', () => {
    const startingPosition: Vector2 = [1, 6];
    const size = {min: 1, max: 1};
    const result = randomDfsCluster(
      startingPosition,
      {candidates: _.candidates, size, coordinate: cartesian},
      _.seed,
    ).run(12);
    assert(result).to.equal([startingPosition]);
  });
});
