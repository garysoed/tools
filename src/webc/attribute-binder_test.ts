import {assert, TestBase} from '../test-base';
TestBase.setup();

import {AttributeBinder} from './attribute-binder';
import {Mocks} from '../mock/mocks';


describe('webc.AttributeBinder', () => {
  const ATTRIBUTE_NAME = 'ATTRIBUTE_NAME';
  let mockElement;
  let mockParser;
  let binder: AttributeBinder<string>;

  beforeEach(() => {
    mockElement = jasmine.createSpyObj('Element', ['getAttribute', 'setAttribute']);
    mockParser = jasmine.createSpyObj('Parser', ['parse', 'stringify']);
    binder = new AttributeBinder<string>(mockElement, ATTRIBUTE_NAME, mockParser);
  });

  describe('delete', () => {
    it('should delete the attribute', () => {
      let mockAttributes = jasmine.createSpyObj('Attributes', ['getNamedItem', 'removeNamedItem']);
      mockAttributes.getNamedItem.and.returnValue({});
      mockElement.attributes = mockAttributes;

      binder.delete();

      assert(mockAttributes.removeNamedItem).to.haveBeenCalledWith(ATTRIBUTE_NAME);
      assert(mockAttributes.getNamedItem).to.haveBeenCalledWith(ATTRIBUTE_NAME);
    });

    it('should do nothing if the attribute does not exist', () => {
      let mockAttributes = jasmine.createSpyObj('Attributes', ['getNamedItem', 'removeNamedItem']);
      mockAttributes.getNamedItem.and.returnValue(null);
      mockElement.attributes = mockAttributes;

      binder.delete();

      assert(mockAttributes.removeNamedItem).toNot.haveBeenCalled();
      assert(mockAttributes.getNamedItem).to.haveBeenCalledWith(ATTRIBUTE_NAME);
    });
  });

  describe('get', () => {
    it('should return the correct attribute', () => {
      let parsedValue = Mocks.object('parsedValue');
      let value = 'value';
      mockElement.getAttribute.and.returnValue(value);

      mockParser.parse.and.returnValue(parsedValue);

      assert(binder.get()).to.equal(parsedValue);
      assert(mockElement.getAttribute).to.haveBeenCalledWith(ATTRIBUTE_NAME);
      assert(mockParser.parse).to.haveBeenCalledWith(value);
    });
  });

  describe('set', () => {
    it('should set the new attribute value', () => {
      let value = Mocks.object('value');
      let stringifiedValue = 'stringifiedValue';
      mockParser.stringify.and.returnValue(stringifiedValue);
      binder.set(value);
      assert(mockElement.setAttribute).to.haveBeenCalledWith(ATTRIBUTE_NAME, stringifiedValue);
      assert(mockParser.stringify).to.haveBeenCalledWith(value);
    });

    it('should set the value to empty string if null', () => {
      let value = Mocks.object('value');
      mockParser.stringify.and.returnValue(null);
      binder.set(value);
      assert(mockElement.setAttribute).to.haveBeenCalledWith(ATTRIBUTE_NAME, '');
      assert(mockParser.stringify).to.haveBeenCalledWith(value);
    });
  });
});
