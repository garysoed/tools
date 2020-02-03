import { RandomGenerator, RandomResult } from './random-generator';
import { mathSeed } from './seed/math-seed';

const ID_CHARS: string[] = [];
// Add the numbers.
for (let i = 0; i < 10; i++) {
  ID_CHARS.push(String(i));
}

// Add the upper case chars.
for (let i = 65; i < 91; i++) {
  ID_CHARS.push(String.fromCharCode(i));
}

// Add the lower case chars.
for (let i = 97; i < 123; i++) {
  ID_CHARS.push(String.fromCharCode(i));
}


/**
 * Picks an integer from the given interval.
 *
 * @param from The start interval (inclusive).
 * @param to The end interval (exclusive).
 * @return Integer picked randomly in the given interval.
 */
export function intRange(from: number, to: number, rng: RandomGenerator): RandomResult<number> {
  const [value, nextRng] = rng.next();
  return [from + Math.floor(value * (to - from)), nextRng];
}

/**
 * Picks an item randomly from the given list.
 *
 * @param values The list to pick the value from.
 * @return A value from the given list.
 */
export function list<T>(values: T[], rng: RandomGenerator): RandomResult<T> {
  const [value, nextRng] = intRange(0, values.length, rng);
  return [values[value], nextRng];
}

/**
 * Generates a random short ID.
 *
 * A short ID is a 7 characters long ID. Each character is a case sensitive alphanumeric
 * character.
 *
 * @return A randomly generated short ID.
 */
export function shortId(rng: RandomGenerator): RandomResult<string> {
  let nextRng = rng;
  const id: string[] = [];
  for (let i = 0; i < 7; i++) {
    const [value, next] = list(ID_CHARS, nextRng);
    id.push(value);
    nextRng = next;
  }

  return [id.join(''), nextRng];
}
