import { TestBase } from '../test-base';
TestBase.setup();

import { assert } from 'gs-testing/export/main';
import { Mocks } from 'gs-testing/export/mock';
import { equals, Property } from './equals';

/**
 * @test
 */
class SimpleClass {
  @Property() a!: number;
  @Property() b!: string;
  ignored!: string;
}

/**
 * @test
 */
class ComplexClass {
  @Property() a!: number;
  @Property() s!: SimpleClass;
}

describe('data.Equals - Functional', () => {
  it('should handle numbers correctly', () => {
    assert(equals(123, 123)).to.beTrue();
    assert(equals(123, 456)).to.beFalse();
  });

  it('should handle records correctly', () => {
    const object = Mocks.object('object');
    assert(equals(object, object)).to.beTrue();
    assert(equals({}, {})).to.beFalse();
  });

  it('should handle simple classes correctly', () => {
    const simple1 = new SimpleClass();
    simple1.a = 123;
    simple1.b = 'b';
    simple1.ignored = 'ignoredA1';

    const simple2 = new SimpleClass();
    simple2.a = 123;
    simple2.b = 'b';
    simple2.ignored = 'ignoredA2';

    const different = new SimpleClass();
    different.a = 456;
    different.b = 'b';
    different.ignored = 'ignoredA1';

    assert(equals(simple1, simple2)).to.beTrue();
    assert(equals(simple1, different)).to.beFalse();
  });

  it('should handle complex classes correctly', () => {
    const complex1 = new ComplexClass();
    complex1.a = 456;
    complex1.s = new SimpleClass();
    complex1.s.a = 123;
    complex1.s.b = 'b';
    complex1.s.ignored = 'ignoredC2';

    const complex2 = new ComplexClass();
    complex2.a = 456;
    complex2.s = new SimpleClass();
    complex2.s.a = 123;
    complex2.s.b = 'b';
    complex2.s.ignored = 'ignoredC2';

    const different = new ComplexClass();
    different.a = 456;
    different.s = new SimpleClass();
    different.s.a = 123;
    different.s.b = 'different';
    different.s.ignored = 'ignoredC2';

    assert(equals(complex1, complex2)).to.beTrue();
    assert(equals(complex1, different)).to.beFalse();
  });
});
