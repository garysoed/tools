/**
 * Specification to generate a bunch of numbers.
 */
export class Spec {
  constructor(
    private readonly start: number,
    private readonly delta: number,
    private readonly end: number,
  ) {}

  /**
   * Generates the values specified.
   */
  generateValues(): number[] {
    const values: number[] = [];
    for (let value = this.start; value < this.end; value += this.delta) {
      values.push(value);
    }

    return values;
  }

  /**
   * The delta of the numbers.
   */
  getDelta(): number {
    return this.delta;
  }

  /**
   * The end value of the range.
   */
  getEnd(): number {
    return this.end;
  }

  /**
   * The starting value of the range. This is inclusive.
   */
  getStart(): number {
    return this.start;
  }

  static newInstance(start: number, delta: number, end: number): Spec {
    if (start > end) {
      throw new Error(`${start} should not be greater than ${end}`);
    }

    if (delta <= 0) {
      throw new Error(`${delta} should be > 0`);
    }

    return new Spec(start, delta, end);
  }
}
