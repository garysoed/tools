import {AnyAssert} from './any-assert';


export class NumberAssert extends AnyAssert<number> {
  beCloseTo(other: number, precision: number): void {
    this.getMatchers_().toBeCloseTo(other, precision);
  }
}
