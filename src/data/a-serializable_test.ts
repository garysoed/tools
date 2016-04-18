import TestBase from '../test-base';
TestBase.setup();

import Serializer, { Field, Serializable } from './a-serializable';

describe('model.Serializer', () => {

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

  describe('toJSON, fromJSON', () => {
    it('should handle basic class', () => {
      let value = 'value';
      let basic = new BasicClass();
      basic.a = value;

      let serialized = Serializer.toJSON(basic);
      expect(serialized).toEqual(jasmine.objectContaining({ 'fieldA': value }));

      expect(Serializer.fromJSON(serialized).a).toEqual(value);
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
      expect(serialized).toEqual(jasmine.objectContaining({
        'fieldA': compositeValue,
        'basic': jasmine.objectContaining({
          'fieldA': basicValue,
        }),
      }));

      let deserialized = Serializer.fromJSON(serialized);
      expect(deserialized.a).toEqual(compositeValue);
      expect(deserialized.basic).toEqual(basic);
    });

    it('should handle null fields', () => {
      let basic = new BasicClass();
      basic.a = null;

      let serialized = Serializer.toJSON(basic);
      expect(serialized).toEqual(jasmine.objectContaining({ 'fieldA': null }));

      expect(Serializer.fromJSON(serialized).a).toEqual(null);
    });

    it('should handle non native non serializable fields', () => {
      let value = { value: 'value' };
      let basic = new BasicClass();
      basic.a = value;

      let serialized = Serializer.toJSON(basic);
      expect(serialized).toEqual(jasmine.objectContaining({ 'fieldA': value }));

      expect(Serializer.fromJSON(serialized).a).toEqual(value);
    });

    it('should handle arrays', () => {
      let value = 'basicValue';
      let basic = new BasicClass();
      basic.a = value;

      let composite = new CompositeClass();
      composite.a = [0, basic];

      let serialized = Serializer.toJSON(composite);
      expect(serialized).toEqual(jasmine.objectContaining({
        'fieldA': [0, jasmine.objectContaining({ 'fieldA': value })],
      }));

      let deserialized = Serializer.fromJSON(serialized);
      expect(deserialized.a).toEqual([0, basic]);
    });

    it('should handle maps', () => {
      let value = 'basicValue';
      let basic = new BasicClass();
      basic.a = value;

      let composite = new CompositeClass();
      composite.a = { 'basic': basic };

      let serialized = Serializer.toJSON(composite);
      expect(serialized).toEqual(jasmine.objectContaining({
        'fieldA': {
          'basic': jasmine.objectContaining({
            'fieldA': value,
          }),
        },
      }));

      let deserialized = Serializer.fromJSON(serialized);
      expect(deserialized.a).toEqual({ 'basic': basic });
    });

    it('should ignore non existent fields', () => {
      let defaultValue = new DefaultValueClass();
      let value = defaultValue.a;
      let json = Serializer.toJSON(defaultValue);

      delete json['fieldA'];

      let deserialized = Serializer.fromJSON(json);
      expect(deserialized.a).toEqual(value);
    });
  });
});
