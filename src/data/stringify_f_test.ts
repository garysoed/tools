import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Stringify } from './stringify';


class SimpleClass {
  @Stringify.Property() a!: number;
  @Stringify.Property() b!: string;
}

class ComplexClass {
  @Stringify.Property() a!: number;
  @Stringify.Property() b!: SimpleClass;
  @Stringify.Property() c!: string;
}

describe('data.Stringify - Functional', () => {
  it('should stringify numbers correctly', () => {
    assert(Stringify.toString(123)).to.equal('123');
  });

  it('should stringify dates correctly', () => {
    const date = new Date(123);
    assert(Stringify.toString(date)).to.equal(date.toLocaleString());
  });

  it('should stringify strings correctly', () => {
    assert(Stringify.toString('string')).to.equal('"string"');
  });

  it('should stringify booleans correctly', () => {
    assert(Stringify.toString(true)).to.equal('true');
  });

  it('should stringify simple objects correctly with single line', () => {
    const simple = new SimpleClass();
    simple.a = 123;
    simple.b = 'b';
    assert(Stringify.toString(simple, {delimiter: '|', pad: ''}))
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
    assert(Stringify.toString(complex, {delimiter: '|', pad: ''}))
        .to.equal('{a: 123|b: {a: 5123|b: "sb"}|c: "c"}');
  });

  it('should stringify simple objects correctly with multiline', () => {
    const simple = new SimpleClass();
    simple.a = 123;
    simple.b = 'b';
    assert(Stringify.toString(simple, {delimiter: '|', pad: '--'}))
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
    assert(Stringify.toString(complex, {delimiter: '|', pad: '--'}))
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
