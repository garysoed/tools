import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Field, Serializable, Serializer} from './a-serializable';

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
      let value = 'value';
      let basic = new BasicClass();
      basic.a = value;

      let serialized = Serializer.toJSON(basic);
      assert(serialized).to.equal(jasmine.objectContaining({ 'fieldA': value }));

      assert(Serializer.fromJSON(serialized).a).to.equal(value);
    });

    it('should recursively convert the fields', () => {
      let basicValue = 'basicValue';
      let compositeValue = 'compositeValue';
      let basic = new BasicClass();
      basic.a = basicValue;

      let composite = new CompositeClass();
      composite.a = compositeValue;
      composite.basic = basic;

      let serialized = Serializer.toJSON(composite);
      assert(serialized).to.equal(jasmine.objectContaining({
        'fieldA': compositeValue,
        'basic': jasmine.objectContaining({
          'fieldA': basicValue,
        }),
      }));

      let deserialized = Serializer.fromJSON(serialized);
      assert(deserialized.a).to.equal(compositeValue);
      assert(deserialized.basic).to.equal(basic);
    });

    it('should handle null fields', () => {
      let basic = new BasicClass();
      basic.a = null;

      let serialized = Serializer.toJSON(basic);
      assert(serialized).to.equal(jasmine.objectContaining({ 'fieldA': null }));

      assert(Serializer.fromJSON(serialized).a).to.equal(null);
    });

    it('should handle non native non serializable fields', () => {
      let value = { value: 'value' };
      let basic = new BasicClass();
      basic.a = value;

      let serialized = Serializer.toJSON(basic);
      assert(serialized).to.equal(jasmine.objectContaining({ 'fieldA': value }));

      assert(Serializer.fromJSON(serialized).a).to.equal(value);
    });

    it('should handle arrays', () => {
      let value = 'basicValue';
      let basic = new BasicClass();
      basic.a = value;

      let composite = new CompositeClass();
      composite.a = [0, basic];

      let serialized = Serializer.toJSON(composite);
      assert(serialized).to.equal(jasmine.objectContaining({
        'fieldA': [0, jasmine.objectContaining({ 'fieldA': value })],
      }));

      let deserialized = Serializer.fromJSON(serialized);
      assert(deserialized.a).to.equal([0, basic]);
    });

    it('should handle maps', () => {
      let value = 'basicValue';
      let basic = new BasicClass();
      basic.a = value;

      let composite = new CompositeClass();
      composite.a = { 'basic': basic };

      let serialized = Serializer.toJSON(composite);
      assert(serialized).to.equal(jasmine.objectContaining({
        'fieldA': {
          'basic': jasmine.objectContaining({
            'fieldA': value,
          }),
        },
      }));

      let deserialized = Serializer.fromJSON(serialized);
      assert(deserialized.a).to.equal({ 'basic': basic });
    });

    it('should ignore non existent fields', () => {
      let defaultValue = new DefaultValueClass();
      let value = defaultValue.a;
      let json = Serializer.toJSON(defaultValue);

      delete json['fieldA'];

      let deserialized = Serializer.fromJSON(json);
      assert(deserialized.a).to.equal(value);
    });

    it('should handle subclasses', () => {
      let value = 'value';
      let subValue = 'subValue';
      let sub = new SubClass();
      sub.a = value;
      sub.subfield = subValue;

      let serialized = Serializer.toJSON(sub);
      assert(serialized).to.equal(jasmine.objectContaining({
        'fieldA': value,
        'subField': subValue,
      }));

      let deserialized: SubClass = Serializer.fromJSON(serialized);
      assert(deserialized.a).to.equal(value);
      assert(deserialized.subfield).to.equal(subValue);
    });
  });
});
