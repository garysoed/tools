import { assert, TestBase } from '../test-base';
TestBase.setup();

import { IntegerParser, ObjectParser, StringParser } from '../parse';


describe('parser.ObjectParser', () => {
  describe('parse', () => {
    it(`should parse correctly`, () => {
      const parser = ObjectParser({a: StringParser, b: IntegerParser});

      assert(parser.parse('{"a":"abc","b":"123"}')).to.equal({a: 'abc', b: 123});
    });

    it(`should return null if the key does not exist`, () => {
      const parser = ObjectParser({a: StringParser, b: IntegerParser});

      assert(parser.parse('{"a":"abc"}')).to.beNull();
    });

    it(`should return null if not a json`, () => {
      const parser = ObjectParser({a: StringParser, b: IntegerParser});

      assert(parser.parse('[]')).to.beNull();
    });
  });

  describe('stringify', () => {
    it(`should stringify correctly`, () => {
      const parser = ObjectParser({a: StringParser, b: IntegerParser});

      assert(parser.stringify({a: 'abc', b: 123})).to.equal('{"a":"abc","b":"123"}');
    });

    it(`should return '' if the value is null`, () => {
      const parser = ObjectParser({a: StringParser, b: IntegerParser});

      assert(parser.stringify(null)).to.equal('');
    });
  });
});
