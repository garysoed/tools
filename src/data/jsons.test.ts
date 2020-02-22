import { assert, objectThat, should, test } from 'gs-testing';

import { getValue, setValue } from './jsons';

test('data.Jsons', () => {
  test('getValue', () => {
    should('retrieve the value correctly', () => {
      const json = {a: {b: {c: 123}}};
      assert(getValue(json, 'a.b') as {}).to.haveProperties({c: 123});
    });

    should('return undefined if the path does not exist', () => {
      const json = {a: {b: {c: 123}}};
      assert(getValue(json, 'a.b.d')).to.equal(undefined);
    });
  });

  test('setValue', () => {
    should('set the value at the correct location', () => {
      const innerObj = { };
      const obj = { a: innerObj };
      setValue(obj, 'a.b.c', 123);
      assert(obj).to.haveProperties({a: objectThat().haveProperties({})});
      assert(innerObj).to.haveProperties({
        b: objectThat().haveProperties({c: 123}),
      });
    });

    should('handle a single value', () => {
      const obj = { };
      setValue(obj, 'abc', 123);
      assert(obj).to.haveProperties({ abc: 123 });
    });

    should('throw error when the path is empty', () => {
      assert(() => {
        setValue({ }, '', 123);
      }).to.throwErrorWithMessage(/not be empty/);
    });
  });
});
