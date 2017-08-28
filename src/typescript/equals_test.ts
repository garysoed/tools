import { assert, TestBase } from '../test-base';
TestBase.setup();

import { equals } from '../typescript';

class TestClass1 {
  constructor(public readonly a: any) { }
}

class TestClass2 {
  constructor(public readonly a: any) { }
}

describe('typescript.equals', () => {
  it(`should return true if the two objects are the same instance`, () => {
    const test = new TestClass1(123);
    assert(equals(test, test)).to.beTrue();
  });

  it(`should return true if the two objects are the same type and have the same fields`, () => {
    const test1 = new TestClass1(123);
    const test2 = new TestClass1(123);
    assert(equals(test1, test2)).to.beTrue();
  });

  it(`should return false if the objects have different fields`, () => {
    const test1 = new TestClass1(123);
    const test2 = new TestClass1('123');
    assert(equals(test1, test2)).to.beFalse();
  });

  it(`should return false if the objects have different types`, () => {
    const test1 = new TestClass1(123);
    const test2 = new TestClass2(123);
    assert(equals(test1, test2)).to.beFalse();
  });

  it(`should recursively check on the field`, () => {
    const test1 = new TestClass1(new TestClass2('abc'));
    const test2 = new TestClass1(new TestClass2('abc'));
    assert(equals(test1, test2)).to.beTrue();

    const test3 = new TestClass1(new TestClass1('abc'));
    assert(equals(test1, test3)).to.beFalse();
  });

  it(`should handle strings`, () => {
    assert(equals('abc', 'abc')).to.beTrue();
    assert(equals('abc', 'def')).to.beFalse();
  });

  it(`should handle arrays`, () => {
    assert(equals([1, 2, 3], [1, 2, 3])).to.beTrue();
    assert(equals([1, 2, 3], [4, 5, 6])).to.beFalse();
  });

  it(`should handle numbers`, () => {
    assert(equals(123, 123)).to.beTrue();
    assert(equals(123, 456)).to.beFalse();
  });

  it(`should handle nulls`, () => {
    assert(equals(null, null)).to.beTrue();
  });
});
