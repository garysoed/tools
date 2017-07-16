import { assert, Fakes, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { Serializer } from '../data/a-serializable';
import { __serializedName, DataModels, TYPE_FIELD_ } from '../datamodel/data-models';
import { ANNOTATIONS } from '../datamodel/field';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';


describe('datamodel.DataModels', () => {
  describe('createGetter_', () => {
    it(`should return function that returns the correct field`, () => {
      const value = Mocks.object('value');
      const key = 'key';
      const instance = Mocks.object('instance');
      instance[key] = value;
      assert(DataModels['createGetter_'](instance, key)()).to.equal(value);
    });
  });

  describe('createSetter_', () => {
    it(`should return a function that creates a new instance with the value`, () => {
      const ctor = Mocks.object('ctor');
      const instance = Mocks.object('instance');
      const key = 'key';
      const mockEqFn = jasmine.createSpy('EqFn');
      mockEqFn.and.returnValue(false);

      const newValue = Mocks.object('newValue');
      const value = Mocks.object('value');
      instance[key] = value;

      const mockAnnotations = jasmine.createSpyObj('Annotations', ['getAttachedValues']);
      mockAnnotations.getAttachedValues.and.returnValue(ImmutableMap.of([
        [key, 'value1'],
      ]));
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      const newInstance = Mocks.object('newInstance');
      spyOn(DataModels, 'newInstance').and.returnValue(newInstance);

      const actualInstance = DataModels['createSetter_'](ctor, instance, key, mockEqFn)(newValue);
      assert(actualInstance).to.be(newInstance);
      assert(newInstance[key]).to.equal(newValue);
      assert(instance[key]).to.equal(value);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(DataModels.newInstance).to.haveBeenCalledWith(ctor);
      assert(mockEqFn).to.haveBeenCalledWith(value, newValue);
    });

    it(`should return a function that returns the same instance if the new value is the same`,
        () => {
      const ctor = Mocks.object('ctor');
      const instance = Mocks.object('instance');
      const key = 'key';
      const mockEqFn = jasmine.createSpy('EqFn');
      mockEqFn.and.returnValue(true);

      const newValue = Mocks.object('newValue');
      const value = Mocks.object('value');
      instance[key] = value;

      const mockAnnotations = jasmine.createSpyObj('Annotations', ['getAttachedValues']);
      mockAnnotations.getAttachedValues.and.returnValue(ImmutableMap.of([
        [key, 'value1'],
      ]));
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);
      spyOn(DataModels, 'newInstance');

      const actualInstance = DataModels['createSetter_'](ctor, instance, key, mockEqFn)(newValue);
      assert(actualInstance).to.be(instance);
      assert(ANNOTATIONS.forCtor).toNot.haveBeenCalled();
      assert(DataModels.newInstance).toNot.haveBeenCalled();
      assert(mockEqFn).to.haveBeenCalledWith(value, newValue);
    });
  });

  describe('fromJson', () => {
    it(`should return the correct instance`, () => {
      const serializedName = 'serializedName';
      const json = Mocks.object('json');
      json[TYPE_FIELD_] = serializedName;
      const instance = Mocks.object('instance');
      spyOn(DataModels, 'fromJsonDataModel_').and.returnValue(instance);

      assert(DataModels.fromJson<any>(json)).to.equal(instance);
      assert(DataModels['fromJsonDataModel_']).to.haveBeenCalledWith(json, serializedName);
    });

    it(`should throw error if the serialized name cannot be found`, () => {
      const json = Mocks.object('json');
      json[TYPE_FIELD_] = undefined;

      assert(() => {
        DataModels.fromJson<any>(json);
      }).to.throwError(/serialized names/);
    });
  });

  describe('fromJsonDataModel_', () => {
    it(`should return the correct instance`, () => {
      const serializedField1 = 'serializedField1';
      const serializedField2 = 'serializedField2';
      const jsonValue1 = Mocks.object('jsonValue1');
      const jsonValue2 = Mocks.object('jsonValue2');
      const json = {
        [serializedField1]: jsonValue1,
        [serializedField2]: jsonValue2,
      };
      const serializedName = 'serializedName';
      const key1 = 'key1';
      const key2 = 'key2';
      const value1 = Mocks.object('value1');
      const value2 = Mocks.object('value2');
      Fakes.build(spyOn(DataModels, 'fromJsonValue_'))
          .when(jsonValue1).return(value1)
          .when(jsonValue2).return(value2);

      const baseClass = Mocks.object('baseClass');
      spyOn(Serializer, 'getRegisteredCtor').and.returnValue(baseClass);

      const instance = Mocks.object('instance');
      spyOn(DataModels, 'newInstance').and.returnValue(instance);

      const mockAnnotations = jasmine.createSpyObj('Annotations', ['getAttachedValues']);
      mockAnnotations.getAttachedValues.and.returnValue(ImmutableMap.of([
        [key1, ImmutableSet.of([{serializedFieldName: serializedField1}])],
        [key2, ImmutableSet.of([{serializedFieldName: serializedField2}])],
      ]));
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      assert(DataModels['fromJsonDataModel_'](json, serializedName)).to.equal(instance);
      assert(instance).to.equal(Matchers.objectContaining({
            [key1]: value1,
            [key2]: value2,
          }));
      assert(DataModels['fromJsonValue_']).to.haveBeenCalledWith(jsonValue1);
      assert(DataModels['fromJsonValue_']).to.haveBeenCalledWith(jsonValue2);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(baseClass);
      assert(DataModels.newInstance).to.haveBeenCalledWith(baseClass);
      assert(Serializer.getRegisteredCtor).to.haveBeenCalledWith(serializedName);
    });

    it(`should throw error if baseClass cannot be found`, () => {
      const json = Mocks.object('json');
      const serializedName = 'serializedName';
      spyOn(Serializer, 'getRegisteredCtor').and.returnValue(null);
      assert(() => {
        DataModels['fromJsonDataModel_'](json, serializedName);
      }).to.throwError(/No constructors/);
    });
  });

  describe('fromJsonValue_', () => {
    it(`should return the correct instance`, () => {
      const json = Mocks.object('json');
      const serializedName = 'serializedName';
      json[TYPE_FIELD_] = serializedName;
      const instance = Mocks.object('instance');
      spyOn(DataModels, 'fromJsonDataModel_').and.returnValue(instance);

      assert(DataModels['fromJsonValue_'](json)).to.equal(instance);
      assert(DataModels['fromJsonDataModel_']).to.haveBeenCalledWith(json, serializedName);
    });

    it(`should use the Serializer if the serializedName cannot be found`, () => {
      const json = Mocks.object('json');
      const instance = Mocks.object('instance');
      spyOn(Serializer, 'fromJSON').and.returnValue(instance);

      assert(DataModels['fromJsonValue_'](json)).to.equal(instance);
      assert(Serializer.fromJSON).to.haveBeenCalledWith(json);
    });

    it(`should return the same value for 1`, () => {
      assert(DataModels['fromJsonValue_'](1)).to.equal(1);
    });

    it(`should return the same value for 'a'`, () => {
      assert(DataModels['fromJsonValue_']('a')).to.equal('a');
    });

    it(`should return the same value for true`, () => {
      assert(DataModels['fromJsonValue_'](true) as boolean).to.beTrue();
    });
  });

  describe('getSerializedName_', () => {
    it(`should return the serialized name`, () => {
      const serializedName = 'serializedName';
      const obj = Mocks.object('obj');
      obj[__serializedName] = serializedName;
      assert(DataModels['getSerializedName_'](obj)).to.equal(serializedName);
    });

    it(`should return null if the object has no serialized names`, () => {
      const obj = Mocks.object('obj');
      assert(DataModels['getSerializedName_'](obj)).to.beNull();
    });
  });

  describe('newInstance', () => {
    it(`should create the methods correctly`, () => {
      abstract class TestClass {}
      const baseClass = TestClass as any;
      const key1 = 'key1';
      const key2 = 'key2';

      const getter1 = Mocks.object('getter1');
      const getter2 = Mocks.object('getter2');
      Fakes.build(spyOn(DataModels, 'createGetter_'))
          .when(Matchers.anyThing(), key1).return(getter1)
          .when(Matchers.anyThing(), key2).return(getter2);

      const setter1 = Mocks.object('setter1');
      const setter2 = Mocks.object('setter2');
      Fakes.build(spyOn(DataModels, 'createSetter_'))
          .when(Matchers.anyThing(), Matchers.anyThing(), key1).return(setter1)
          .when(Matchers.anyThing(), Matchers.anyThing(), key2).return(setter2);

      const eqFn1 = Mocks.object('eqFn1');
      const eqFn2 = Mocks.object('eqFn2');
      const mockAnnotations = jasmine.createSpyObj('Annotations', ['getAttachedValues']);
      mockAnnotations.getAttachedValues.and.returnValue(ImmutableMap.of([
        [key1, ImmutableSet.of([{eqFn: eqFn1, fieldName: 'Field1'}])],
        [key2, ImmutableSet.of([{eqFn: eqFn2, fieldName: 'Field2'}])],
      ]));
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      const serializedName = 'serializedName';
      spyOn(Serializer, 'getSerializedName').and.returnValue(serializedName);

      const instance = DataModels.newInstance<any>(baseClass);
      assert(instance).to.equal(Matchers.any(baseClass));
      assert(instance.getField1).to.equal(getter1);
      assert(instance.setField1).to.equal(setter1);
      assert(instance.getField2).to.equal(getter2);
      assert(instance.setField2).to.equal(setter2);
      assert(instance[__serializedName]).to.equal(serializedName);
      assert(Serializer.getSerializedName).to.haveBeenCalledWith(baseClass.prototype);
      assert(DataModels['createGetter_']).to.haveBeenCalledWith(instance, key1);
      assert(DataModels['createSetter_']).to.haveBeenCalledWith(baseClass, instance, key1, eqFn1);
      assert(DataModels['createGetter_']).to.haveBeenCalledWith(instance, key2);
      assert(DataModels['createSetter_']).to.haveBeenCalledWith(baseClass, instance, key2, eqFn2);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestClass);
    });

    it(`should handle the case where the object is not serializable`, () => {
      abstract class TestClass {}
      const baseClass = TestClass as any;
      const key1 = 'key1';
      const key2 = 'key2';

      const getter1 = Mocks.object('getter1');
      const getter2 = Mocks.object('getter2');
      Fakes.build(spyOn(DataModels, 'createGetter_'))
          .when(Matchers.anyThing(), key1).return(getter1)
          .when(Matchers.anyThing(), key2).return(getter2);

      const setter1 = Mocks.object('setter1');
      const setter2 = Mocks.object('setter2');
      Fakes.build(spyOn(DataModels, 'createSetter_'))
          .when(Matchers.anyThing(), Matchers.anyThing(), key1).return(setter1)
          .when(Matchers.anyThing(), Matchers.anyThing(), key2).return(setter2);

      const eqFn1 = Mocks.object('eqFn1');
      const eqFn2 = Mocks.object('eqFn2');
      const mockAnnotations = jasmine.createSpyObj('Annotations', ['getAttachedValues']);
      mockAnnotations.getAttachedValues.and.returnValue(ImmutableMap.of([
        [key1, ImmutableSet.of([{eqFn: eqFn1, fieldName: 'Field1'}])],
        [key2, ImmutableSet.of([{eqFn: eqFn2, fieldName: 'Field2'}])],
      ]));
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      spyOn(Serializer, 'getSerializedName').and.returnValue(null);

      const instance = DataModels.newInstance<any>(baseClass);
      assert(instance).to.equal(Matchers.any(baseClass));
      assert(instance.getField1).to.equal(getter1);
      assert(instance.setField1).to.equal(setter1);
      assert(instance.getField2).to.equal(getter2);
      assert(instance.setField2).to.equal(setter2);
      assert(DataModels['createGetter_']).to.haveBeenCalledWith(instance, key1);
      assert(DataModels['createSetter_']).to.haveBeenCalledWith(baseClass, instance, key1, eqFn1);
      assert(DataModels['createGetter_']).to.haveBeenCalledWith(instance, key2);
      assert(DataModels['createSetter_']).to.haveBeenCalledWith(baseClass, instance, key2, eqFn2);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestClass);
    });
  });

  describe('toJson', () => {
    it(`should return the correct json`, () => {
      const serializedName = 'serializedName';
      const obj = Mocks.object('obj');
      obj[__serializedName] = serializedName;
      const json = Mocks.object('json');
      spyOn(DataModels, 'toJsonDataModel_').and.returnValue(json);
      assert(DataModels.toJson(obj)).to.equal(json);
      assert(DataModels['toJsonDataModel_']).to.haveBeenCalledWith(obj, serializedName);
    });

    it(`should throw error if the object is not serializable`, () => {
      const obj = Mocks.object('obj');
      spyOn(DataModels, 'getSerializedName_').and.returnValue(null);
      assert(() => {
        DataModels.toJson(obj);
      }).to.throwError(/was not created/);
    });
  });

  describe('toJsonDataModel_', () => {
    it(`should return the correct JSON`, () => {
      const serializedName = 'serializedName';
      const key1 = 'key1';
      const key2 = 'key2';
      const value1 = Mocks.object('value1');
      const value2 = Mocks.object('value2');
      const obj = Mocks.object('obj');
      obj[key1] = value1;
      obj[key2] = value2;

      const field1 = 'field1';
      const field2 = 'field2';
      const mockAnnotations = jasmine.createSpyObj('Annotations', ['getAttachedValues']);
      mockAnnotations.getAttachedValues.and.returnValue(ImmutableMap.of([
        [key1, ImmutableSet.of([{serializedFieldName: field1}])],
        [key2, ImmutableSet.of([{serializedFieldName: field2}])],
      ]));
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      const jsonValue1 = Mocks.object('jsonValue1');
      const jsonValue2 = Mocks.object('jsonValue2');
      Fakes.build(spyOn(DataModels, 'toJsonValue_'))
          .when(value1).return(jsonValue1)
          .when(value2).return(jsonValue2);

      const baseClass = Mocks.object('baseClass');
      spyOn(Serializer, 'getRegisteredCtor').and.returnValue(baseClass);

      assert(DataModels['toJsonDataModel_'](obj, serializedName)).to.equal({
        [TYPE_FIELD_]: serializedName,
        [field1]: jsonValue1,
        [field2]: jsonValue2,
      });
      assert(DataModels['toJsonValue_']).to.haveBeenCalledWith(value1);
      assert(DataModels['toJsonValue_']).to.haveBeenCalledWith(value2);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(baseClass);
      assert(Serializer.getRegisteredCtor).to.haveBeenCalledWith(serializedName);
    });

    it(`should throw error if the baseClass cannot be found`, () => {
      const obj = Mocks.object('obj');
      const serializedName = 'serializedName';
      spyOn(Serializer, 'getRegisteredCtor').and.returnValue(null);
      assert(() => {
        DataModels['toJsonDataModel_'](obj, serializedName);
      }).to.throwError(/No constructors found/);
    });
  });

  describe('toJsonValue_', () => {
    it(`should return the correct json`, () => {
      const serializedName = 'serializedName';
      const obj = Mocks.object('obj');
      obj[__serializedName] = serializedName;

      const json = Mocks.object('json');
      spyOn(DataModels, 'toJsonDataModel_').and.returnValue(json);

      assert(DataModels['toJsonValue_'](obj)).to.equal(json);
      assert(DataModels['toJsonDataModel_']).to.haveBeenCalledWith(obj, serializedName);
    });

    it(`should use the Serializer method if there are no serializedNames`, () => {
      const obj = Mocks.object('obj');

      const json = Mocks.object('json');
      spyOn(Serializer, 'toJSON').and.returnValue(json);

      assert(DataModels['toJsonValue_'](obj)).to.equal(json);
      assert(Serializer.toJSON).to.haveBeenCalledWith(obj);
    });

    it(`should return the same value for 1`, () => {
      assert(DataModels['toJsonValue_'](1)).to.equal(1);
    });

    it(`should return the same value for 'a'`, () => {
      assert(DataModels['toJsonValue_']('a')).to.equal('a');
    });

    it(`should return the same value for true`, () => {
      assert(DataModels['toJsonValue_'](true) as boolean).to.beTrue();
    });
  });
});
