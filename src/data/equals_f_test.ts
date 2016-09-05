import {TestBase} from '../test-base';
TestBase.setup();

import {Equals} from './equals';
import {Mocks} from '../mock/mocks';


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
    expect(Equals.equals(123, 123)).toEqual(true);
    expect(Equals.equals(123, 456)).toEqual(false);
  });

  it('should handle records correctly', () => {
    let object = Mocks.object('object');
    expect(Equals.equals(object, object)).toEqual(true);
    expect(Equals.equals({}, {})).toEqual(false);
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

    expect(Equals.equals(simple1, simple2)).toEqual(true);
    expect(Equals.equals(simple1, different)).toEqual(false);
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

    expect(Equals.equals(complex1, complex2)).toEqual(true);
    expect(Equals.equals(complex1, different)).toEqual(false);
  });
});
