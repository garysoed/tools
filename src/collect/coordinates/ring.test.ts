import {assert, should, test} from 'gs-testing';

import {cartesian} from './cartesian';
import {hex} from './hex';
import {ring} from './ring';

test('@tools/src/collect/coordinates/ring', () => {
  should('return the correct vectors for 2d cartesian with distance 2', () => {
    assert(ring(2, cartesian, 2)).to.equal(
      new Map([
        [0, new Set([[0, 0]])],
        [
          1,
          new Set([
            [1, 0],
            [0, 1],
            [-1, 0],
            [0, -1],
          ]),
        ],
        [
          2,
          new Set([
            [2, 0],
            [1, 1],
            [0, 2],
            [-1, 1],
            [-2, 0],
            [-1, -1],
            [0, -2],
            [1, -1],
          ]),
        ],
      ]),
    );
  });

  should('return the correct vectors for 2d hex with distance 2', () => {
    assert(ring(2, hex, 2)).to.equal(
      new Map([
        [0, new Set([[0, 0]])],
        [
          1,
          new Set([
            [1, 0],
            [1, 1],
            [0, 1],
            [-1, 0],
            [-1, -1],
            [0, -1],
          ]),
        ],
        [
          2,
          new Set([
            [2, 0],
            [2, 1],
            [2, 2],
            [1, 2],
            [0, 2],
            [-1, 1],
            [-2, 0],
            [-2, -1],
            [-2, -2],
            [-1, -2],
            [0, -2],
            [1, -1],
          ]),
        ],
      ]),
    );
  });

  should('return the correct vectors for 3d cartesian with distance 2', () => {
    assert(ring(3, cartesian, 2)).to.equal(
      new Map([
        [0, new Set([[0, 0, 0]])],
        [
          1,
          new Set([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [-1, 0, 0],
            [0, -1, 0],
            [0, 0, -1],
          ]),
        ],
        [
          2,
          new Set([
            [2, 0, 0],
            [0, 2, 0],
            [0, 0, 2],
            [0, 1, 1],
            [1, 0, 1],
            [1, 1, 0],
            [0, -1, 1],
            [-1, 0, 1],
            [-1, 1, 0],
            [0, 1, -1],
            [1, 0, -1],
            [1, -1, 0],
            [0, -1, -1],
            [-1, 0, -1],
            [-1, -1, 0],
            [-2, 0, 0],
            [0, -2, 0],
            [0, 0, -2],
          ]),
        ],
      ]),
    );
  });

  should('return the correct vectors for 3d hex with distance 2', () => {
    assert(ring(3, hex, 2)).to.equal(
      new Map([
        [0, new Set([[0, 0, 0]])],
        [
          1,
          new Set([
            [1, 0, 0],
            [-1, 0, 0],
            [0, 1, 0],
            [0, -1, 0],
            [0, 0, 1],
            [0, 0, -1],
            [1, 1, 0],
            [-1, -1, 0],
            [1, 0, 1],
            [-1, 0, -1],
            [0, 1, 1],
            [0, -1, -1],
          ]),
        ],
        [
          2,
          new Set([
            [2, 0, 0],
            [1, -1, 0],
            [1, 0, -1],
            [2, 1, 0],
            [2, 0, 1],
            [1, 1, 1],
            [1, -1, -1],
            [-2, 0, 0],
            [-1, 1, 0],
            [-1, 0, 1],
            [-2, -1, 0],
            [-2, 0, -1],
            [-1, 1, 1],
            [-1, -1, -1],
            [0, 2, 0],
            [0, 1, -1],
            [1, 2, 0],
            [-1, 1, -1],
            [0, 2, 1],
            [0, -2, 0],
            [0, -1, 1],
            [-1, -2, 0],
            [1, -1, 1],
            [0, -2, -1],
            [0, 0, 2],
            [-1, -1, 1],
            [1, 0, 2],
            [0, 1, 2],
            [0, 0, -2],
            [1, 1, -1],
            [-1, 0, -2],
            [0, -1, -2],
            [2, 2, 0],
            [2, 1, 1],
            [1, 2, 1],
            [-2, -2, 0],
            [-2, -1, -1],
            [-1, -2, -1],
            [2, 0, 2],
            [1, 1, 2],
            [-2, 0, -2],
            [-1, -1, -2],
            [0, 2, 2],
            [0, -2, -2],
          ]),
        ],
      ]),
    );
  });
});
