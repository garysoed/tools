import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { Serializer } from '../data/a-serializable';
import { JsonParser } from '../parse/json-parser';
import { SerializableParser } from '../parse/serializable-parser';


describe('parse.SerializableParser', () => {
  describe('parse', () => {
    it(`should return the correct data model`, () => {
      const stringValue = 'stringValue';
      const dataModel = Mocks.object('dataModel');
      spyOn(Serializer, 'fromJSON').and.returnValue(dataModel);

      const json = Mocks.object('json');
      spyOn(JsonParser, 'parse').and.returnValue(json);

      assert(SerializableParser<any>().parse(stringValue)).to.equal(dataModel);
      assert(Serializer.fromJSON).to.haveBeenCalledWith(json);
      assert(JsonParser.parse).to.haveBeenCalledWith(stringValue);
    });

    it(`should return null if the JSON is invalid`, () => {
      const stringValue = 'stringValue';
      const dataModel = Mocks.object('dataModel');
      spyOn(Serializer, 'fromJSON').and.returnValue(dataModel);

      spyOn(JsonParser, 'parse').and.returnValue(null);

      assert(SerializableParser<any>().parse(stringValue)).to.beNull();
      assert(JsonParser.parse).to.haveBeenCalledWith(stringValue);
    });

    it(`should return null if the value is null`, () => {
      assert(SerializableParser<any>().parse(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    it(`should return the correct string`, () => {
      const dataModel = Mocks.object('dataModel');
      const stringValue = 'stringValue';
      spyOn(JsonParser, 'stringify').and.returnValue(stringValue);

      const json = Mocks.object('json');
      spyOn(Serializer, 'toJSON').and.returnValue(json);

      assert(SerializableParser<any>().stringify(dataModel)).to.equal(stringValue);
      assert(JsonParser.stringify).to.haveBeenCalledWith(json);
      assert(Serializer.toJSON).to.haveBeenCalledWith(dataModel);
    });
  });
});
