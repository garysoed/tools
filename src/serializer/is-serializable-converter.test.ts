import { assert, objectThat, should, test } from 'gs-testing';
import { Converter, strict } from 'nabu';

import { IsSerializable } from './is-serializable';
import { isSerializable } from './is-serializable-converter';

class TestClass implements IsSerializable {
  constructor(readonly data: unknown) { }

  serialize(): unknown {
    return this.data;
  }
}

test('serializer.IsSerializableConverter', () => {
  let converter: Converter<TestClass, unknown>;

  beforeEach(() => {
    converter = isSerializable(TestClass);
  });

  test('convertBackward', () => {
    should(`convert correctly`, () => {
      const data = {a: 1, b: 2};
      assert(strict(converter).convertBackward(data)).to.haveProperties({
        data: objectThat<Record<string, unknown>>().haveProperties(data),
      });
    });
  });

  test('convertForward', () => {
    should(`convert correctly`, () => {
      const data = {a: 1, b: 2};
      assert(strict(converter).convertForward(new TestClass(data)) as {}).to.haveProperties(data);
    });
  });
});
