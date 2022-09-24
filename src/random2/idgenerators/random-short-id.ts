import {$asArray} from '../../collect/operators/as-array';
import {$join} from '../../collect/operators/join';
import {$map} from '../../collect/operators/map';
import {$take} from '../../collect/operators/take';
import {$pipe} from '../../typescript/pipe';
import {asRandom, Random} from '../random';


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
export function randomShortId(seed: Random<number>): Random<string> {
  return seed.takeValues(values => {
    const id = $pipe(
        values,
        $take(7),
        $map(value => {
          const index = Math.floor(value * ID_CHARS.length);
          return ID_CHARS[index];
        }),
        $asArray(),
        $join(''),
    );
    return asRandom(id);
  });
}
