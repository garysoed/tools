import { assert } from 'gs-testing/export/main';
import { TestBase } from 'gs-testing/export/main';
import { deepClone, getValue, setValue } from './jsons';



describe('data.Jsons', () => {
  describe('deepClone', () => {
    should('clone the given object', () => {
      const original = {
        a: { b: 2 },
      };
      const clone = deepClone(original);
      assert(clone).to.equal(original);
      assert(clone).toNot.be(original);
    });
  });

  describe('getValue', () => {
    should('retrieve the value correctly', () => {
      const json = {a: {b: {c: 123}}};
      assert(getValue(json, 'a.b')).to.equal({c: 123});
    });

    should('return undefined if the path does not exist', () => {
      const json = {a: {b: {c: 123}}};
      assert(getValue(json, 'a.b.d')).to.equal(undefined);
    });
  });

  describe('setValue', () => {
    should('set the value at the correct location', () => {
      const innerObj = { };
      const obj = { a: innerObj };
      setValue(obj, 'a.b.c', 123);
      assert(obj).to.equal({ a: innerObj });
      assert(innerObj).to.equal({ b: { c: 123 } });
    });

    should('handle a single value', () => {
      const obj = { };
      setValue(obj, 'abc', 123);
      assert(obj).to.equal({ abc: 123 });
    });

    should('throw error when the path is empty', () => {
      assert(() => {
        setValue({ }, '', 123);
      }).to.throwErrorWithMessage(/not be empty/);
    });
  });
});
