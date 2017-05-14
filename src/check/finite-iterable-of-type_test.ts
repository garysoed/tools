import { assert, TestBase } from '../test-base';
TestBase.setup();

import { FiniteIterableOfType } from '../check/finite-iterable-of-type';
import { NumberType } from '../check/number-type';
import { ImmutableSet } from '../immutable/immutable-set';


describe('check.FiniteIterableOfType', () => {
  it('should return true if the target is a finite iterable of the correct type', () => {
    assert(FiniteIterableOfType(NumberType).check(ImmutableSet.of([1, 2, 3]))).to.beTrue();
  });

  it('should return false if an item in the target is not the correct type', () => {
    assert(FiniteIterableOfType(NumberType).check(ImmutableSet.of([1, 2, '3']))).to.beFalse();
  });

  it('should return false if the target is not a finite iterable', () => {
    assert(FiniteIterableOfType(NumberType).check([1, 2, '3'])).to.beFalse();
  });
});
