import { assert, should } from 'gs-testing/export/main';

import { JsonParser } from '../parse/json-parser';


describe('parse.JsonParser', () => {
  describe('convertBackward', () => {
    should(`parse correctly`, () => {
      assert(JsonParser().convertBackward('{"a":1,"b":{"c":"2"}}')).to.equal({a: 1, b: {c: '2'}});
    });

    should(`return null for null inputs`, () => {
      assert(JsonParser().convertBackward(null)).to.beNull();
    });

    should(`return null for ''`, () => {
      assert(JsonParser().convertBackward('')).to.beNull();
    });
  });

  describe('convertForward', () => {
    should(`stringify correctly`, () => {
      assert(JsonParser().convertForward({a: 1, b: {c: '2'}})).to.equal('{"a":1,"b":{"c":"2"}}');
    });

    should(`return '' for null`, () => {
      assert(JsonParser().convertForward(null)).to.equal('');
    });
  });
});
