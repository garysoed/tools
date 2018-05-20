import { assert, TestBase } from '../test-base';
import { Property, toString } from './stringify';
TestBase.setup();

/**
 * @test
 */
class SimpleClass {
  @Property() a!: number;
  @Property() b!: string;
}

/**
 * @test
 */
class ComplexClass {
  @Property() a!: number;
  @Property() b!: SimpleClass;
  @Property() c!: string;
}

describe('data.Stringify - Functional', () => {
  it('should stringify numbers correctly', () => {
    assert(toString(123)).to.equal('123');
  });

  it('should stringify dates correctly', () => {
    const date = new Date(123);
    assert(toString(date)).to.equal(date.toLocaleString());
  });

  it('should stringify strings correctly', () => {
    assert(toString('string')).to.equal('"string"');
  });

  it('should stringify booleans correctly', () => {
    assert(toString(true)).to.equal('true');
  });

  it('should stringify simple objects correctly with single line', () => {
    const simple = new SimpleClass();
    simple.a = 123;
    simple.b = 'b';
    assert(toString(simple, {delimiter: '|', pad: ''}))
        .to.equal('{a: 123|b: "b"}');
  });

  it('should stringify complex objects correctly with single line', () => {
    const simple = new SimpleClass();
    simple.a = 5123;
    simple.b = 'sb';
    const complex = new ComplexClass();
    complex.a = 123;
    complex.b = simple;
    complex.c = 'c';
    assert(toString(complex, {delimiter: '|', pad: ''}))
        .to.equal('{a: 123|b: {a: 5123|b: "sb"}|c: "c"}');
  });

  it('should stringify simple objects correctly with multiline', () => {
    const simple = new SimpleClass();
    simple.a = 123;
    simple.b = 'b';
    assert(toString(simple, {delimiter: '|', pad: '--'}))
        .to.equal([
          '{',
          '--a: 123|',
          '--b: "b"',
          '}',
        ].join('\n'));
  });

  it('should stringify complex objects correctly with multi line', () => {
    const simple = new SimpleClass();
    simple.a = 5123;
    simple.b = 'sb';
    const complex = new ComplexClass();
    complex.a = 123;
    complex.b = simple;
    complex.c = 'c';
    assert(toString(complex, {delimiter: '|', pad: '--'}))
        .to.equal([
          '{',
          '--a: 123|',
          '--b: {',
          '----a: 5123|',
          '----b: "sb"',
          '--}|',
          '--c: "c"',
          '}',
        ].join('\n'));
  });
});
