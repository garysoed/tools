import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';

import { AttributeBinder } from './attribute-binder';


describe('webc.AttributeBinder', () => {
  const ATTRIBUTE_NAME = 'ATTRIBUTE_NAME';
  let mockElement: any;
  let mockParser: any;
  let binder: AttributeBinder<string>;

  beforeEach(() => {
    mockElement = jasmine.createSpyObj('Element', ['getAttribute', 'setAttribute']);
    mockParser = jasmine.createSpyObj('Parser', ['parse', 'stringify']);
    binder = new AttributeBinder<string>(mockElement, ATTRIBUTE_NAME, mockParser);
  });

  describe('delete', () => {
    it('should delete the attribute', () => {
      const mockAttributes =
          jasmine.createSpyObj('Attributes', ['getNamedItem', 'removeNamedItem']);
      mockAttributes.getNamedItem.and.returnValue({});
      mockElement.attributes = mockAttributes;

      binder.delete();

      assert(mockAttributes.removeNamedItem).to.haveBeenCalledWith(ATTRIBUTE_NAME);
      assert(mockAttributes.getNamedItem).to.haveBeenCalledWith(ATTRIBUTE_NAME);
    });

    it('should do nothing if the attribute does not exist', () => {
      const mockAttributes =
          jasmine.createSpyObj('Attributes', ['getNamedItem', 'removeNamedItem']);
      mockAttributes.getNamedItem.and.returnValue(null);
      mockElement.attributes = mockAttributes;

      binder.delete();

      assert(mockAttributes.removeNamedItem).toNot.haveBeenCalled();
      assert(mockAttributes.getNamedItem).to.haveBeenCalledWith(ATTRIBUTE_NAME);
    });
  });

  describe('get', () => {
    it('should return the correct attribute', () => {
      const parsedValue = Mocks.object('parsedValue');
      const value = 'value';
      mockElement.getAttribute.and.returnValue(value);

      mockParser.parse.and.returnValue(parsedValue);

      assert(binder.get()).to.equal(parsedValue);
      assert(mockElement.getAttribute).to.haveBeenCalledWith(ATTRIBUTE_NAME);
      assert(mockParser.parse).to.haveBeenCalledWith(value);
    });
  });

  describe('set', () => {
    it('should set the new attribute value', () => {
      const value = Mocks.object('value');
      const stringifiedValue = 'stringifiedValue';
      mockParser.stringify.and.returnValue(stringifiedValue);
      binder.set(value);
      assert(mockElement.setAttribute).to.haveBeenCalledWith(ATTRIBUTE_NAME, stringifiedValue);
      assert(mockParser.stringify).to.haveBeenCalledWith(value);
    });

    it('should set the value to empty string if null', () => {
      const value = Mocks.object('value');
      mockParser.stringify.and.returnValue(null);
      binder.set(value);
      assert(mockElement.setAttribute).to.haveBeenCalledWith(ATTRIBUTE_NAME, '');
      assert(mockParser.stringify).to.haveBeenCalledWith(value);
    });

    it(`should delete the attribute if the value is falsy`, () => {
      spyOn(binder, 'delete');
      binder.set(null);
      assert(binder.delete).to.haveBeenCalledWith();
    });
  });
});
