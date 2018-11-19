import { assert, Fakes, Matchers, Mocks, TestBase } from 'gs-testing/export/main';


import { Serializer } from '../data/a-serializable';
import { __serializedName, DataModels } from '../datamodel/data-models';
import { ANNOTATIONS } from '../datamodel/field';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';


describe('datamodel.DataModels', () => {
  describe('createGetter_', () => {
    should(`return function that returns the correct field`, () => {
      const value = mocks.object('value');
      const key = 'key';
      const instance = mocks.object('instance');
      instance[key] = value;
      assert(DataModels['createGetter_'](instance, key)()).to.equal(value);
    });
  });

  describe('createSetter_', () => {
    should(`return a function that creates a new instance with the value`, () => {
      const ctor = mocks.object('ctor');
      const instance = mocks.object('instance');
      const key = 'key';
      const mockEqFn = createSpy('EqFn');
      mockEqFn.and.returnValue(false);

      const newValue = mocks.object('newValue');
      const value = mocks.object('value');
      instance[key] = value;

      const mockAnnotations = createSpyObject('Annotations', ['getAttachedValues']);
      mockAnnotations.getAttachedValues.and.returnValue(ImmutableMap.of([
        [key, 'value1'],
      ]));
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      const newInstance = mocks.object('newInstance');
      spyOn(DataModels, 'newInstance').and.returnValue(newInstance);

      const actualInstance = DataModels['createSetter_'](ctor, instance, key, mockEqFn)(newValue);
      assert(actualInstance).to.be(newInstance);
      assert(newInstance[key]).to.equal(newValue);
      assert(instance[key]).to.equal(value);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(DataModels.newInstance).to.haveBeenCalledWith(ctor);
      assert(mockEqFn).to.haveBeenCalledWith(value, newValue);
    });

    should(`return a function that returns the same instance if the new value is the same`,
        () => {
      const ctor = mocks.object('ctor');
      const instance = mocks.object('instance');
      const key = 'key';
      const mockEqFn = createSpy('EqFn');
      mockEqFn.and.returnValue(true);

      const newValue = mocks.object('newValue');
      const value = mocks.object('value');
      instance[key] = value;

      const mockAnnotations = createSpyObject('Annotations', ['getAttachedValues']);
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

  describe('getSerializedName', () => {
    should(`return the serialized name`, () => {
      const serializedName = 'serializedName';
      const obj = mocks.object('obj');
      obj[__serializedName] = serializedName;
      assert(DataModels.getSerializedName(obj)).to.equal(serializedName);
    });

    should(`return null if the object has no serialized names`, () => {
      const obj = mocks.object('obj');
      assert(DataModels.getSerializedName(obj)).to.beNull();
    });
  });

  describe('newInstance', () => {
    should(`create the methods correctly`, () => {
      abstract class TestClass {}
      const baseClass = TestClass as any;
      const key1 = 'key1';
      const initValue1 = mocks.object('initValue1');
      const key2 = 'key2';

      const getter1 = mocks.object('getter1');
      const getter2 = mocks.object('getter2');
      Fakes.build(spyOn(DataModels, 'createGetter_'))
          .when(Matchers.anyThing(), key1).return(getter1)
          .when(Matchers.anyThing(), key2).return(getter2);

      const setter1 = mocks.object('setter1');
      const setter2 = mocks.object('setter2');
      Fakes.build(spyOn(DataModels, 'createSetter_'))
          .when(Matchers.anyThing(), Matchers.anyThing(), key1).return(setter1)
          .when(Matchers.anyThing(), Matchers.anyThing(), key2).return(setter2);

      const eqFn1 = mocks.object('eqFn1');
      const eqFn2 = mocks.object('eqFn2');
      const mockAnnotations = createSpyObject('Annotations', ['getAttachedValues']);
      mockAnnotations.getAttachedValues.and.returnValue(ImmutableMap.of([
        [key1, ImmutableSet.of([{eqFn: eqFn1, fieldName: 'Field1'}])],
        [key2, ImmutableSet.of([{eqFn: eqFn2, fieldName: 'Field2'}])],
      ]));
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      const serializedName = 'serializedName';
      spyOn(Serializer, 'getSerializedName').and.returnValue(serializedName);

      const instance = DataModels.newInstance<any>(
          baseClass,
          ImmutableMap.of([[key1, initValue1]]));
      assert(instance).to.equal(Matchers.any(baseClass));
      assert(instance.getField1).to.equal(getter1);
      assert(instance.setField1).to.equal(setter1);
      assert(instance.getField2).to.equal(getter2);
      assert(instance.setField2).to.equal(setter2);
      assert(instance[key1]).to.equal(initValue1);
      assert(instance[key2]).toNot.beDefined();
      assert(instance[__serializedName]).to.equal(serializedName);
      assert(Serializer.getSerializedName).to.haveBeenCalledWith(baseClass.prototype);
      assert(DataModels['createGetter_']).to.haveBeenCalledWith(instance, key1);
      assert(DataModels['createSetter_']).to.haveBeenCalledWith(baseClass, instance, key1, eqFn1);
      assert(DataModels['createGetter_']).to.haveBeenCalledWith(instance, key2);
      assert(DataModels['createSetter_']).to.haveBeenCalledWith(baseClass, instance, key2, eqFn2);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestClass);
    });

    should(`handle the case where the object is not serializable`, () => {
      abstract class TestClass {}
      const baseClass = TestClass as any;
      const key1 = 'key1';
      const key2 = 'key2';

      const getter1 = mocks.object('getter1');
      const getter2 = mocks.object('getter2');
      Fakes.build(spyOn(DataModels, 'createGetter_'))
          .when(Matchers.anyThing(), key1).return(getter1)
          .when(Matchers.anyThing(), key2).return(getter2);

      const setter1 = mocks.object('setter1');
      const setter2 = mocks.object('setter2');
      Fakes.build(spyOn(DataModels, 'createSetter_'))
          .when(Matchers.anyThing(), Matchers.anyThing(), key1).return(setter1)
          .when(Matchers.anyThing(), Matchers.anyThing(), key2).return(setter2);

      const eqFn1 = mocks.object('eqFn1');
      const eqFn2 = mocks.object('eqFn2');
      const mockAnnotations = createSpyObject('Annotations', ['getAttachedValues']);
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
});
