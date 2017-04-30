import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';

import { CustomElementUtil } from './custom-element-util';


describe('webc.CustomElementUtil', () => {
  describe('addAttribute', () => {
    it('should add all the attributes correctly', () => {
      const parsedValue = Mocks.object('parsedValue');
      const stringValue = 'stringValue';
      const mockAttributeParser = jasmine.createSpyObj('AttributeParser', ['parse', 'stringify']);
      mockAttributeParser.parse.and.returnValue(parsedValue);
      mockAttributeParser.stringify.and.returnValue(stringValue);

      const attrValue = 'attrValue';
      const mockElement = jasmine.createSpyObj('Element', ['getAttribute', 'setAttribute']);
      mockElement.getAttribute.and.returnValue(attrValue);

      CustomElementUtil.addAttributes(mockElement, {'attrName': mockAttributeParser});

      const newValue = Mocks.object('newValue');
      mockElement.attrName = newValue;
      assert(mockElement.setAttribute).to.haveBeenCalledWith('attr-name', stringValue);
      assert(mockAttributeParser.stringify).to.haveBeenCalledWith(newValue);

      assert(mockElement.attrName).to.equal(parsedValue);
      assert(mockElement.getAttribute).to.haveBeenCalledWith('attr-name');
      assert(mockAttributeParser.parse).to.haveBeenCalledWith(attrValue);
    });
  });

  describe('getConfig / setConfig', () => {
    it('should set / get the configuration correctly', () => {
      const config = Mocks.object('config');
      const ctor = Mocks.object('ctor');

      CustomElementUtil.setConfig(ctor, config);
      assert(CustomElementUtil.getConfig(ctor)).to.equal(config);
    });
  });

  describe('getElement / setElement', () => {
    it('should set / get the element correctly', () => {
      const instance = Mocks.object('instance');
      const element = Mocks.object('element');

      CustomElementUtil.setElement(instance, element);
      assert(CustomElementUtil.getElement(instance)).to.equal(element);
    });
  });
});
