import { mathRng } from './math-rng';
import { RandomGenerator } from './random-generator';

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
 * Generates random objects.
 */
export class RandomizerImpl {
  constructor(private readonly rng: RandomGenerator) { }

  /**
   * Picks an integer from the given interval.
   *
   * @param from The start interval (inclusive).
   * @param to The end interval (exclusive).
   * @return Integer picked randomly in the given interval.
   */
  intRange(from: number, to: number): number {
    return from + Math.floor(this.rng.next()[0] * (to - from));
  }

  /**
   * Picks an item randomly from the given list.
   *
   * @param values The list to pick the value from.
   * @return A value from the given list.
   */
  list<T>(values: T[]): T {
    return values[this.intRange(0, values.length)];
  }

  /**
   * Generates a random short ID.
   *
   * A short ID is a 7 characters long ID. Each character is a case sensitive alphanumeric
   * character.
   *
   * @return A randomly generated short ID.
   */
  shortId(): string {
    const id: string[] = [];
    for (let i = 0; i < 7; i++) {
      id.push(this.list(ID_CHARS));
    }

    return id.join('');
  }
}

export function Randomizer(rng: () => RandomGenerator = mathRng): RandomizerImpl {
  return new RandomizerImpl(rng());
}
