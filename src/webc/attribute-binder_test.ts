import {assert, TestBase} from '../test-base';
TestBase.setup();

import {AttributeBinder} from './attribute-binder';


describe('webc.AttributeBinder', () => {
  const ATTRIBUTE_NAME = 'ATTRIBUTE_NAME';
  let binder: AttributeBinder<string>;
  let mockElement;

  beforeEach(() => {
    mockElement = jasmine.createSpyObj('Element', ['getAttribute', 'setAttribute']);
    binder = new AttributeBinder(mockElement, ATTRIBUTE_NAME);
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
      let value = 'value';
      mockElement.getAttribute.and.returnValue(value);

      assert(binder.get()).to.equal(value);
      assert(mockElement.getAttribute).to.haveBeenCalledWith(ATTRIBUTE_NAME);
    });
  });

  describe('set', () => {
    it('should set the new attribute value', () => {
      let value = 'value';
      binder.set(value);
      assert(mockElement.setAttribute).to.haveBeenCalledWith(ATTRIBUTE_NAME, value);
    });

    it('should set the value to empty string if null', () => {
      binder.set(null);
      assert(mockElement.setAttribute).to.haveBeenCalledWith(ATTRIBUTE_NAME, '');
    });
  });
});
