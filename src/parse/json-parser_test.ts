import { assert, TestBase } from '../test-base';
TestBase.setup();

import { JsonParser } from '../parse/json-parser';


describe('parse.JsonParser', () => {
  describe('parse', () => {
    it(`should parse correctly`, () => {
      assert(JsonParser.parse('{"a":1,"b":{"c":"2"}}')).to.equal({a: 1, b: {c: '2'}});
    });

    it(`should return null for null inputs`, () => {
      assert(JsonParser.parse(null)).to.beNull();
    });

    it(`should return null for ''`, () => {
      assert(JsonParser.parse('')).to.beNull();
    });
  });

  describe('stringify', () => {
    it(`should stringify correctly`, () => {
      assert(JsonParser.stringify({a: 1, b: {c: '2'}})).to.equal('{"a":1,"b":{"c":"2"}}');
    });

    it(`should return '' for null`, () => {
      assert(JsonParser.stringify(null)).to.equal('');
    });
  });
});
