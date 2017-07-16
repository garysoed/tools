import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { DataModels } from '../datamodel/data-models';
import { DataModelParser } from '../parse/data-model-parser';
import { JsonParser } from '../parse/json-parser';

describe('parse.DataModelParser', () => {
  describe('parse', () => {
    it(`should return the correct data model`, () => {
      const stringValue = 'stringValue';
      const dataModel = Mocks.object('dataModel');
      spyOn(DataModels, 'fromJson').and.returnValue(dataModel);

      const json = Mocks.object('json');
      spyOn(JsonParser, 'parse').and.returnValue(json);

      assert(DataModelParser<any>().parse(stringValue)).to.equal(dataModel);
      assert(DataModels.fromJson).to.haveBeenCalledWith(json);
      assert(JsonParser.parse).to.haveBeenCalledWith(stringValue);
    });

    it(`should return null if the JSON is invalid`, () => {
      const stringValue = 'stringValue';
      const dataModel = Mocks.object('dataModel');
      spyOn(DataModels, 'fromJson').and.returnValue(dataModel);

      spyOn(JsonParser, 'parse').and.returnValue(null);

      assert(DataModelParser<any>().parse(stringValue)).to.beNull();
      assert(JsonParser.parse).to.haveBeenCalledWith(stringValue);
    });

    it(`should return null if the value is null`, () => {
      assert(DataModelParser<any>().parse(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    it(`should return the correct string`, () => {
      const dataModel = Mocks.object('dataModel');
      const stringValue = 'stringValue';
      spyOn(JsonParser, 'stringify').and.returnValue(stringValue);

      const json = Mocks.object('json');
      spyOn(DataModels, 'toJson').and.returnValue(json);

      assert(DataModelParser<any>().stringify(dataModel)).to.equal(stringValue);
      assert(JsonParser.stringify).to.haveBeenCalledWith(json);
      assert(DataModels.toJson).to.haveBeenCalledWith(dataModel);
    });
  });
});
