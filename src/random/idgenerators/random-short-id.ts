import {$asArray} from '../../collect/operators/as-array';
import {$map} from '../../collect/operators/map';
import {$pipe} from '../../collect/operators/pipe';
import {$take} from '../../collect/operators/take';
import {countableIterable} from '../../collect/structures/countable-iterable';
import {randomPickItem} from '../operators/random-pick-item';
import {Random} from '../random';


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
export function randomShortId(rng: Random): string {
  return $pipe(
      countableIterable(),
      $take(7),
      $map(() => randomPickItem(ID_CHARS, rng)),
      $asArray(),
  ).join('');
}
