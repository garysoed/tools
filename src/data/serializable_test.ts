import { TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { assert } from 'gs-testing/export/main';
import { Field } from './field';
import { Serializable } from './serializable';
import { fromJSON, toJSON } from './serializer';

describe('data.Serializable', () => {

  /**
   * @test
   */
  @Serializable('basic')
  class BasicClass {
    @Field('fieldA') a: any;
  }

  /**
   * @test
   */
  @Serializable('composite')
  class CompositeClass {
    @Field('fieldA') a: any;
    @Field('basic') basic!: BasicClass;
  }

  /**
   * @test
   */
  @Serializable('default')
  class DefaultValueClass {
    @Field('fieldA') a: any;

    constructor() {
      this.a = 'value';
    }
  }

  /**
   * @test
   */
  @Serializable('sub', BasicClass)
  class SubClass extends BasicClass {
    @Field('subField') subfield: any;
  }

  describe('toJSON, fromJSON', () => {
    should('handle basic class', () => {
      const value = 'value';
      const basic = new BasicClass();
      basic.a = value;

      const serialized = toJSON(basic);
      assert(serialized).to.equal(jasmine.objectContaining({fieldA: value}));

      assert(fromJSON(serialized).a).to.equal(value);
    });

    should('recursively convert the fields', () => {
      const basicValue = 'basicValue';
      const compositeValue = 'compositeValue';
      const basic = new BasicClass();
      basic.a = basicValue;

      const composite = new CompositeClass();
      composite.a = compositeValue;
      composite.basic = basic;

      const serialized = toJSON(composite);
      assert(serialized).to.equal(jasmine.objectContaining({
        basic: jasmine.objectContaining({
          fieldA: basicValue,
        }),
        fieldA: compositeValue,
      }));

      const deserialized = fromJSON(serialized);
      assert(deserialized.a).to.equal(compositeValue);
      assert(deserialized.basic).to.equal(basic);
    });

    should('handle null fields', () => {
      const basic = new BasicClass();
      basic.a = null;

      const serialized = toJSON(basic);
      assert(serialized).to.equal(jasmine.objectContaining({ fieldA: null }));

      assert(fromJSON(serialized).a).to.equal(null);
    });

    should('handle non native non serializable fields', () => {
      const value = { value: 'value' };
      const basic = new BasicClass();
      basic.a = value;

      const serialized = toJSON(basic);
      assert(serialized).to.equal(jasmine.objectContaining({ fieldA: value }));

      assert(fromJSON(serialized).a).to.equal(value);
    });

    should('handle arrays', () => {
      const value = 'basicValue';
      const basic = new BasicClass();
      basic.a = value;

      const composite = new CompositeClass();
      composite.a = [0, basic];

      const serialized = toJSON(composite);
      assert(serialized).to.equal(jasmine.objectContaining({
        fieldA: [0, jasmine.objectContaining({ fieldA: value })],
      }));

      const deserialized = fromJSON(serialized);
      assert(deserialized.a).to.equal([0, basic]);
    });

    should('handle maps', () => {
      const value = 'basicValue';
      const basic = new BasicClass();
      basic.a = value;

      const composite = new CompositeClass();
      composite.a = { basic };

      const serialized = toJSON(composite);
      assert(serialized).to.equal(jasmine.objectContaining({
        fieldA: {
          basic: jasmine.objectContaining({
            fieldA: value,
          }),
        },
      }));

      const deserialized = fromJSON(serialized);
      assert(deserialized.a).to.equal({ basic });
    });

    should('ignore non existent fields', () => {
      const defaultValue = new DefaultValueClass();
      const value = defaultValue.a;
      const json = toJSON(defaultValue);

      delete json.fieldA;

      const deserialized = fromJSON(json);
      assert(deserialized.a).to.equal(value);
    });

    should('handle subclasses', () => {
      const value = 'value';
      const subValue = 'subValue';
      const sub = new SubClass();
      sub.a = value;
      sub.subfield = subValue;

      const serialized = toJSON(sub);
      assert(serialized).to.equal(jasmine.objectContaining({
        fieldA: value,
        subField: subValue,
      }));

      const deserialized: SubClass = fromJSON(serialized);
      assert(deserialized.a).to.equal(value);
      assert(deserialized.subfield).to.equal(subValue);
    });
  });
});
