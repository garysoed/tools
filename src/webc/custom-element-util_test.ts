import {assert, TestBase} from 'src/test-base';
TestBase.setup();

import {Mocks} from 'src/mock/mocks';

import {CustomElementUtil} from './custom-element-util';


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
      assert(mockElement.setAttribute).to.haveBeenCalledWith('attr-name', stringValue);
      assert(mockAttributeParser.stringify).to.haveBeenCalledWith(newValue);

      assert(mockElement.attrName).to.equal(parsedValue);
      assert(mockElement.getAttribute).to.haveBeenCalledWith('attr-name');
      assert(mockAttributeParser.parse).to.haveBeenCalledWith(attrValue);
    });
  });

  describe('getConfig / setConfig', () => {
    it('should set / get the configuration correctly', () => {
      let config = Mocks.object('config');
      let ctor = Mocks.object('ctor');

      CustomElementUtil.setConfig(ctor, config);
      assert(CustomElementUtil.getConfig(ctor)).to.equal(config);
    });
  });

  describe('getElement / setElement', () => {
    it('should set / get the element correctly', () => {
      let instance = Mocks.object('instance');
      let element = Mocks.object('element');

      CustomElementUtil.setElement(instance, element);
      assert(CustomElementUtil.getElement(instance)).to.equal(element);
    });
  });
});
