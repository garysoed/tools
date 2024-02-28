import {asRandom, Random} from './random';

export function randomPickInt(
  from: number,
  to: number,
  seed: Random<number>,
): Random<number> {
  return seed.take((value) => {
    const candidate = from + Math.floor(value * (to - from));
    return asRandom(Math.min(Math.max(candidate, from), to));
  });
}
