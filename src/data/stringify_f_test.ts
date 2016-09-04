import {TestBase} from '../test-base';
TestBase.setup();

import {Stringify} from './stringify';


class SimpleClass {
  @Stringify.Property() a: number;
  @Stringify.Property() b: string;
}

class ComplexClass {
  @Stringify.Property() a: number;
  @Stringify.Property() b: SimpleClass;
  @Stringify.Property() c: string;
}

describe('data.Stringify - Functional', () => {
  it('should stringify numbers correctly', () => {
    expect(Stringify.toString(123)).toEqual('123');
  });

  it('should stringify dates correctly', () => {
    let date = new Date(123);
    expect(Stringify.toString(date)).toEqual(date.toLocaleString());
  });

  it('should stringify strings correctly', () => {
    expect(Stringify.toString('string')).toEqual('"string"');
  });

  it('should stringify booleans correctly', () => {
    expect(Stringify.toString(true)).toEqual('true');
  });

  it('should stringify simple objects correctly with single line', () => {
    let simple = new SimpleClass();
    simple.a = 123;
    simple.b = 'b';
    expect(Stringify.toString(simple, {delimiter: '|', pad: ''}))
        .toEqual('{a: 123|b: "b"}');
  });

  it('should stringify complex objects correctly with single line', () => {
    let simple = new SimpleClass();
    simple.a = 5123;
    simple.b = 'sb';
    let complex = new ComplexClass();
    complex.a = 123;
    complex.b = simple;
    complex.c = 'c';
    expect(Stringify.toString(complex, {delimiter: '|', pad: ''}))
        .toEqual('{a: 123|b: {a: 5123|b: "sb"}|c: "c"}');
  });

  it('should stringify simple objects correctly with multiline', () => {
    let simple = new SimpleClass();
    simple.a = 123;
    simple.b = 'b';
    expect(Stringify.toString(simple, {delimiter: '|', pad: '--'}))
        .toEqual([
          '{',
          '--a: 123|',
          '--b: "b"',
          '}',
        ].join('\n'));
  });

  it('should stringify complex objects correctly with multi line', () => {
    let simple = new SimpleClass();
    simple.a = 5123;
    simple.b = 'sb';
    let complex = new ComplexClass();
    complex.a = 123;
    complex.b = simple;
    complex.c = 'c';
    expect(Stringify.toString(complex, {delimiter: '|', pad: '--'}))
        .toEqual([
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
