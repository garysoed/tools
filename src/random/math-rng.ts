import { Rng } from './rng';

export function* mathRng(): Rng<void> {
  while (true) {
    yield {state: undefined, item: Math.random()};
  }
}
