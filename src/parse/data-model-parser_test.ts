import { assert, Fakes, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { Serializer } from '../data';
import { DataModel, DataModels } from '../datamodel';
import { ANNOTATIONS } from '../datamodel/field';
import { ImmutableMap, ImmutableSet } from '../immutable';
import { Parser } from '../interfaces';
import { DataModelParser, JsonParser } from '../parse';
import { TYPE_FIELD_ } from '../parse/data-model-parser';

describe('parse.DataModelParser', () => {
  let parser: Parser<DataModel<any>>;

  beforeEach(() => {
    parser = DataModelParser();
  });

  describe('fromJson_', () => {
    it(`should return the correct instance`, () => {
      const serializedName = 'serializedName';
      const json = Mocks.object('json');
      json[TYPE_FIELD_] = serializedName;
      const instance = Mocks.object('instance');

      spyOn(parser, 'fromJsonDataModel_').and.returnValue(instance);

      assert(parser['fromJson_'](json)).to.equal(instance);
      assert(parser['fromJsonDataModel_']).to.haveBeenCalledWith(json, serializedName);
    });

    it(`should throw error if the serialized name cannot be found`, () => {
      const json = Mocks.object('json');
      json[TYPE_FIELD_] = undefined;

      assert(() => {
        parser['fromJson_'](json);
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
      const mockParser = jasmine.createSpyObj('Parser', ['parse']);
      Fakes.build(mockParser.parse)
          .when(jsonValue1).return(value1)
          .when(jsonValue2).return(value2);

      const baseClass = Mocks.object('baseClass');
      spyOn(Serializer, 'getRegisteredCtor').and.returnValue(baseClass);

      const instance = Mocks.object('instance');
      spyOn(DataModels, 'newInstance').and.returnValue(instance);

      const mockAnnotations = jasmine.createSpyObj('Annotations', ['getAttachedValues']);
      mockAnnotations.getAttachedValues.and.returnValue(ImmutableMap.of([
        [key1, ImmutableSet.of([{serializedFieldName: serializedField1, parser: mockParser}])],
        [key2, ImmutableSet.of([{serializedFieldName: serializedField2, parser: mockParser}])],
      ]));
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      assert(parser['fromJsonDataModel_'](json, serializedName)).to.equal(instance);
      assert(instance).to.equal(Matchers.objectContaining({
            [key1]: value1,
            [key2]: value2,
          }));
      assert(mockParser.parse).to.haveBeenCalledWith(jsonValue1);
      assert(mockParser.parse).to.haveBeenCalledWith(jsonValue2);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(baseClass);
      assert(DataModels.newInstance).to.haveBeenCalledWith(baseClass);
      assert(Serializer.getRegisteredCtor).to.haveBeenCalledWith(serializedName);
    });

    it(`should throw error if baseClass cannot be found`, () => {
      const json = Mocks.object('json');
      const serializedName = 'serializedName';
      spyOn(Serializer, 'getRegisteredCtor').and.returnValue(null);
      assert(() => {
        parser['fromJsonDataModel_'](json, serializedName);
      }).to.throwError(/No constructors/);
    });
  });

  describe('parse', () => {
    it(`should return the correct data model`, () => {
      const stringValue = 'stringValue';
      const dataModel = Mocks.object('dataModel');
      spyOn(parser, 'fromJson_').and.returnValue(dataModel);

      const json = Mocks.object('json');
      spyOn(JsonParser, 'parse').and.returnValue(json);

      assert(parser.parse(stringValue)).to.equal(dataModel);
      assert(parser['fromJson_']).to.haveBeenCalledWith(json);
      assert(JsonParser.parse).to.haveBeenCalledWith(stringValue);
    });

    it(`should return null if the JSON is invalid`, () => {
      const stringValue = 'stringValue';
      const dataModel = Mocks.object('dataModel');
      spyOn(parser, 'fromJson_').and.returnValue(dataModel);

      spyOn(JsonParser, 'parse').and.returnValue(null);

      assert(parser.parse(stringValue)).to.beNull();
      assert(JsonParser.parse).to.haveBeenCalledWith(stringValue);
    });

    it(`should return null if the value is null`, () => {
      assert(parser.parse(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    it(`should return the correct string`, () => {
      const dataModel = Mocks.object('dataModel');
      const stringValue = 'stringValue';
      spyOn(JsonParser, 'stringify').and.returnValue(stringValue);

      const json = Mocks.object('json');
      spyOn(parser, 'toJson_').and.returnValue(json);

      assert(parser.stringify(dataModel)).to.equal(stringValue);
      assert(JsonParser.stringify).to.haveBeenCalledWith(json);
      assert(parser['toJson_']).to.haveBeenCalledWith(dataModel);
    });

    it(`should return empty string if null`, () => {
      assert(parser.stringify(null)).to.equal('');
    });
  });

  describe('toJson_', () => {
    it(`should return the correct json`, () => {
      const serializedName = 'serializedName';
      const obj = Mocks.object('obj');
      spyOn(DataModels, 'getSerializedName').and.returnValue(serializedName);
      const json = Mocks.object('json');
      spyOn(parser, 'toJsonDataModel_').and.returnValue(json);

      assert(parser['toJson_'](obj)).to.equal(json);
      assert(parser['toJsonDataModel_']).to.haveBeenCalledWith(obj, serializedName);
    });

    it(`should throw error if the object is not serializable`, () => {
      const obj = Mocks.object('obj');
      spyOn(DataModels, 'getSerializedName').and.returnValue(null);
      assert(() => {
        parser['toJson_'](obj);
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

      const jsonValue1 = Mocks.object('jsonValue1');
      const jsonValue2 = Mocks.object('jsonValue2');
      const mockParser = jasmine.createSpyObj('Parser', ['stringify']);
      Fakes.build(mockParser.stringify)
          .when(value1).return(jsonValue1)
          .when(value2).return(jsonValue2);

      const field1 = 'field1';
      const field2 = 'field2';
      const mockAnnotations = jasmine.createSpyObj('Annotations', ['getAttachedValues']);
      mockAnnotations.getAttachedValues.and.returnValue(ImmutableMap.of([
        [key1, ImmutableSet.of([{serializedFieldName: field1, parser: mockParser}])],
        [key2, ImmutableSet.of([{serializedFieldName: field2, parser: mockParser}])],
      ]));
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      const baseClass = Mocks.object('baseClass');
      spyOn(Serializer, 'getRegisteredCtor').and.returnValue(baseClass);

      assert(parser['toJsonDataModel_'](obj, serializedName)).to.equal({
        [TYPE_FIELD_]: serializedName,
        [field1]: jsonValue1,
        [field2]: jsonValue2,
      });
      assert(mockParser.stringify).to.haveBeenCalledWith(value1);
      assert(mockParser.stringify).to.haveBeenCalledWith(value2);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(baseClass);
      assert(Serializer.getRegisteredCtor).to.haveBeenCalledWith(serializedName);
    });

    it(`should throw error if the baseClass cannot be found`, () => {
      const obj = Mocks.object('obj');
      const serializedName = 'serializedName';
      spyOn(Serializer, 'getRegisteredCtor').and.returnValue(null);
      assert(() => {
        parser['toJsonDataModel_'](obj, serializedName);
      }).to.throwError(/No constructors found/);
    });
  });
});
