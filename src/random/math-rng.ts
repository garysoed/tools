import { Rng } from './rng';

/**
 * RNG implementation using Math.random.
 */
export class MathRng implements Rng {
  next(): number {
    return Math.random();
  }
}
