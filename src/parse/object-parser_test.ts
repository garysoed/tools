import { assert, should } from 'gs-testing/export/main';
import { IntegerParser } from './integer-parser';
import { ObjectParser } from './object-parser';
import { StringParser } from './string-parser';


describe('parser.ObjectParser', () => {
  describe('convertBackward', () => {
    should(`parse correctly`, () => {
      const parser = ObjectParser({a: StringParser, b: IntegerParser});

      assert(parser.convertBackward('{"a":"abc","b":"123"}')).to.equal({a: 'abc', b: 123});
    });

    should(`return null if the key does not exist`, () => {
      const parser = ObjectParser({a: StringParser, b: IntegerParser});

      assert(parser.convertBackward('{"a":"abc"}')).to.beNull();
    });

    should(`return null if not a json`, () => {
      const parser = ObjectParser({a: StringParser, b: IntegerParser});

      assert(parser.convertBackward('[]')).to.beNull();
    });
  });

  describe('convertForward', () => {
    should(`stringify correctly`, () => {
      const parser = ObjectParser({a: StringParser, b: IntegerParser});

      assert(parser.convertForward({a: 'abc', b: 123})).to.equal('{"a":"abc","b":"123"}');
    });

    should(`return '' if the value is null`, () => {
      const parser = ObjectParser({a: StringParser, b: IntegerParser});

      assert(parser.convertForward(null)).to.equal('');
    });
  });
});
