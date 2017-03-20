import { Validate } from '../valid/validate';


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
    let values: number[] = [];
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
    Validate.batch({
      'BOUNDARIES': Validate.number(start).toNot.beGreaterThan(end),
      'DELTA': Validate.number(delta).to.beGreaterThan(0),
    }).to.allBeValid().assertValid();
    return new Spec(start, delta, end);
  }
}
