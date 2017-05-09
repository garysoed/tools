import { Finite } from '../interfaces/finite';
import { IterableAssert } from '../jasmine/iterable-assert';

export class FiniteIterableAssert<T> extends IterableAssert<T> {
  constructor(
      private finiteIterableValue_: Iterable<T> & Finite<T>,
      reversed: boolean,
      expect: (actual: any) => jasmine.Matchers) {
    super(finiteIterableValue_, reversed, expect);
  }

  haveElements(elements: T[]): void {
    const values: T[] = [];
    for (const value of this.finiteIterableValue_) {
      values.push(value);
    }
    this.getMatchers_(values).toEqual(elements);
  }
}
// TODO: Mutable
