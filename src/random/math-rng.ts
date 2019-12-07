import { Rng } from './rng';

export function* mathRng(): Rng {
  while (true) {
    yield Math.random();
  }
}
