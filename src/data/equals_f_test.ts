import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';

import {Equals} from './equals';


class SimpleClass {
  @Equals.Property() a: number;
  @Equals.Property() b: string;
  ignored: string;
}

class ComplexClass {
  @Equals.Property() a: number;
  @Equals.Property() s: SimpleClass;
}

describe('data.Equals - Functional', () => {
  it('should handle numbers correctly', () => {
    assert(Equals.equals(123, 123)).to.beTrue();
    assert(Equals.equals(123, 456)).to.beFalse();
  });

  it('should handle records correctly', () => {
    let object = Mocks.object('object');
    assert(Equals.equals(object, object)).to.beTrue();
    assert(Equals.equals({}, {})).to.beFalse();
  });

  it('should handle simple classes correctly', () => {
    let simple1 = new SimpleClass();
    simple1.a = 123;
    simple1.b = 'b';
    simple1.ignored = 'ignoredA1';

    let simple2 = new SimpleClass();
    simple2.a = 123;
    simple2.b = 'b';
    simple2.ignored = 'ignoredA2';

    let different = new SimpleClass();
    different.a = 456;
    different.b = 'b';
    different.ignored = 'ignoredA1';

    assert(Equals.equals(simple1, simple2)).to.beTrue();
    assert(Equals.equals(simple1, different)).to.beFalse();
  });

  it('should handle complex classes correctly', () => {
    let complex1 = new ComplexClass();
    complex1.a = 456;
    complex1.s = new SimpleClass();
    complex1.s.a = 123;
    complex1.s.b = 'b';
    complex1.s.ignored = 'ignoredC2';

    let complex2 = new ComplexClass();
    complex2.a = 456;
    complex2.s = new SimpleClass();
    complex2.s.a = 123;
    complex2.s.b = 'b';
    complex2.s.ignored = 'ignoredC2';

    let different = new ComplexClass();
    different.a = 456;
    different.s = new SimpleClass();
    different.s.a = 123;
    different.s.b = 'different';
    different.s.ignored = 'ignoredC2';

    assert(Equals.equals(complex1, complex2)).to.beTrue();
    assert(Equals.equals(complex1, different)).to.beFalse();
  });
});
