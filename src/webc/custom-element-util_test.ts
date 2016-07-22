import {TestBase} from '../test-base';
TestBase.setup();

import {CustomElementUtil} from './custom-element-util';
import {Mocks} from '../mock/mocks';


describe('webc.CustomElementUtil', () => {
  describe('addAttribute', () => {
    it('should add all the attributes correctly', () => {
      let parsedValue = Mocks.object('parsedValue');
      let stringValue = 'stringValue';
      let mockAttributeParser = jasmine.createSpyObj('AttributeParser', ['parse', 'stringify']);
      mockAttributeParser.parse.and.returnValue(parsedValue);
      mockAttributeParser.stringify.and.returnValue(stringValue);

      let attrValue = 'attrValue';
      let mockElement = jasmine.createSpyObj('Element', ['getAttribute', 'setAttribute']);
      mockElement.getAttribute.and.returnValue(attrValue);

      CustomElementUtil.addAttributes(mockElement, {'attrName': mockAttributeParser});

      let newValue = Mocks.object('newValue');
      mockElement.attrName = newValue;
      expect(mockElement.setAttribute).toHaveBeenCalledWith('attr-name', stringValue);
      expect(mockAttributeParser.stringify).toHaveBeenCalledWith(newValue);

      expect(mockElement.attrName).toEqual(parsedValue);
      expect(mockElement.getAttribute).toHaveBeenCalledWith('attr-name');
      expect(mockAttributeParser.parse).toHaveBeenCalledWith(attrValue);
    });
  });

  describe('getConfig / setConfig', () => {
    it('should set / get the configuration correctly', () => {
      let config = Mocks.object('config');
      let ctor = Mocks.object('ctor');

      CustomElementUtil.setConfig(ctor, config);
      expect(CustomElementUtil.getConfig(ctor)).toEqual(config);
    });
  });

  describe('getElement / setElement', () => {
    it('should set / get the element correctly', () => {
      let instance = Mocks.object('instance');
      let element = Mocks.object('element');

      CustomElementUtil.setElement(instance, element);
      expect(CustomElementUtil.getElement(instance)).toEqual(element);
    });
  });
});
