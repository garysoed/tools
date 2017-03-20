import { MathJs } from './math-js';
import { Rng } from './rng';

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


export class Randomizer {
  private rng_: Rng;

  /**
   * @param rng
   */
  constructor(rng: Rng) {
    this.rng_ = rng;
  }

  /**
   * Picks an integer from the given interval.
   *
   * @param from The start interval (inclusive).
   * @param to The end interval (exclusive).
   * @return Integer picked randomly in the given interval.
   */
  intRange(from: number, to: number): number {
    return from + Math.floor(this.rng_.next() * (to - from));
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
    let id: string[] = [];
    for (let i = 0; i < 7; i++) {
      id.push(this.list(ID_CHARS));
    }
    return id.join('');
  }
}

export function Random(rng: Rng = new MathJs()): Randomizer {
  return new Randomizer(rng);
}
