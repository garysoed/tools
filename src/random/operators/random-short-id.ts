import { RandomGenerator, RandomResult } from '../random-generator';

import { randomItem } from './random-item';

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
 * Generates a random short ID.
 *
 * A short ID is a 7 characters long ID. Each character is a case sensitive alphanumeric
 * character.
 *
 * @return A randomly generated short ID.
 */
export function randomShortId(rng: RandomGenerator): RandomResult<string> {
  let nextRng = rng;
  const id: string[] = [];
  for (let i = 0; i < 7; i++) {
    const [value, next] = randomItem(ID_CHARS, nextRng);
    id.push(value);
    nextRng = next;
  }

  return [id.join(''), nextRng];
}
