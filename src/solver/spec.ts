/**
 * Specification to generate a bunch of numbers.
 */
export class Spec {
  private delta_: number;
  private end_: number;
  private start_: number;

  constructor(start: number, delta: number, end: number) {
    this.delta_ = delta;
    this.end_ = end;
    this.start_ = start;
  }

  /**
   * The delta of the numbers.
   */
  getDelta(): number {
    return this.delta_;
  }

  /**
   * Generates the values specified.
   */
  generateValues(): number[] {
    const values: number[] = [];
    for (let value = this.start_; value < this.end_; value += this.delta_) {
      values.push(value);
    }
    return values;
  }

  /**
   * The end value of the range.
   */
  getEnd(): number {
    return this.end_;
  }

  /**
   * The starting value of the range. This is inclusive.
   */
  getStart(): number {
    return this.start_;
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
