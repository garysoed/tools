import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Field, Serializable, Serializer } from './a-serializable';

describe('data.Serializable', () => {

  @Serializable('basic')
  class BasicClass {
    @Field('fieldA') a: any;
  }

  @Serializable('composite')
  class CompositeClass {
    @Field('fieldA') a: any;
    @Field('basic') basic: BasicClass;
  }

  @Serializable('default')
  class DefaultValueClass {
    @Field('fieldA') a: any;

    constructor() {
      this.a = 'value';
    }
  }

  @Serializable('sub', BasicClass)
  class SubClass extends BasicClass {
    @Field('subField') subfield: any;
  }

  describe('toJSON, fromJSON', () => {
    it('should handle basic class', () => {
      const value = 'value';
      const basic = new BasicClass();
      basic.a = value;

      const serialized = Serializer.toJSON(basic);
      assert(serialized).to.equal(jasmine.objectContaining({ 'fieldA': value }));

      assert(Serializer.fromJSON(serialized).a).to.equal(value);
    });

    it('should recursively convert the fields', () => {
      const basicValue = 'basicValue';
      const compositeValue = 'compositeValue';
      const basic = new BasicClass();
      basic.a = basicValue;

      const composite = new CompositeClass();
      composite.a = compositeValue;
      composite.basic = basic;

      const serialized = Serializer.toJSON(composite);
      assert(serialized).to.equal(jasmine.objectContaining({
        'basic': jasmine.objectContaining({
          'fieldA': basicValue,
        }),
        'fieldA': compositeValue,
      }));

      const deserialized = Serializer.fromJSON(serialized);
      assert(deserialized.a).to.equal(compositeValue);
      assert(deserialized.basic).to.equal(basic);
    });

    it('should handle null fields', () => {
      const basic = new BasicClass();
      basic.a = null;

      const serialized = Serializer.toJSON(basic);
      assert(serialized).to.equal(jasmine.objectContaining({ 'fieldA': null }));

      assert(Serializer.fromJSON(serialized).a).to.equal(null);
    });

    it('should handle non native non serializable fields', () => {
      const value = { value: 'value' };
      const basic = new BasicClass();
      basic.a = value;

      const serialized = Serializer.toJSON(basic);
      assert(serialized).to.equal(jasmine.objectContaining({ 'fieldA': value }));

      assert(Serializer.fromJSON(serialized).a).to.equal(value);
    });

    it('should handle arrays', () => {
      const value = 'basicValue';
      const basic = new BasicClass();
      basic.a = value;

      const composite = new CompositeClass();
      composite.a = [0, basic];

      const serialized = Serializer.toJSON(composite);
      assert(serialized).to.equal(jasmine.objectContaining({
        'fieldA': [0, jasmine.objectContaining({ 'fieldA': value })],
      }));

      const deserialized = Serializer.fromJSON(serialized);
      assert(deserialized.a).to.equal([0, basic]);
    });

    it('should handle maps', () => {
      const value = 'basicValue';
      const basic = new BasicClass();
      basic.a = value;

      const composite = new CompositeClass();
      composite.a = { 'basic': basic };

      const serialized = Serializer.toJSON(composite);
      assert(serialized).to.equal(jasmine.objectContaining({
        'fieldA': {
          'basic': jasmine.objectContaining({
            'fieldA': value,
          }),
        },
      }));

      const deserialized = Serializer.fromJSON(serialized);
      assert(deserialized.a).to.equal({ 'basic': basic });
    });

    it('should ignore non existent fields', () => {
      const defaultValue = new DefaultValueClass();
      const value = defaultValue.a;
      const json = Serializer.toJSON(defaultValue);

      delete json['fieldA'];

      const deserialized = Serializer.fromJSON(json);
      assert(deserialized.a).to.equal(value);
    });

    it('should handle subclasses', () => {
      const value = 'value';
      const subValue = 'subValue';
      const sub = new SubClass();
      sub.a = value;
      sub.subfield = subValue;

      const serialized = Serializer.toJSON(sub);
      assert(serialized).to.equal(jasmine.objectContaining({
        'fieldA': value,
        'subField': subValue,
      }));

      const deserialized: SubClass = Serializer.fromJSON(serialized);
      assert(deserialized.a).to.equal(value);
      assert(deserialized.subfield).to.equal(subValue);
    });
  });
});
