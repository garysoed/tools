import { AnyAssert } from './any-assert';


export class NumberAssert extends AnyAssert<number> {
  /**
   * Checks that the number is close to the given number.
   */
  beCloseTo(other: number, precision: number): void {
    this.getMatchers_().toBeCloseTo(other, precision);
  }
}
// TODO: Mutable
