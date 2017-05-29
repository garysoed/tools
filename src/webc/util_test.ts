import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';
import { Util } from '../webc/util';


describe('webc.Util', () => {
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

      Util.addAttributes(mockElement, {'attrName': mockAttributeParser});

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

      Util.setConfig(ctor, config);
      assert(Util.getConfig(ctor)).to.equal(config);
    });
  });

  describe('getElement / setElement', () => {
    it('should set / get the element correctly', () => {
      const instance = Mocks.object('instance');
      const element = Mocks.object('element');

      Util.setElement(instance, element);
      assert(Util.getElement(instance)).to.equal(element);
    });
  });

  describe('resolveSelector', () => {
    it('should return the correct element if selector is specified', () => {
      const targetEl = Mocks.object('targetEl');
      const mockShadowRoot = jasmine.createSpyObj('ShadowRoot', ['querySelector']);
      mockShadowRoot.querySelector.and.returnValue(targetEl);

      const selector = 'selector';
      const element = Mocks.object('element');
      element.shadowRoot = mockShadowRoot;

      assert(Util.resolveSelector(selector, element)).to.equal(targetEl);
      assert(mockShadowRoot.querySelector).to.haveBeenCalledWith(selector);
    });

    it('should create the root element when the selector is null', () => {
      const element = Mocks.object('element');

      assert(Util.resolveSelector(null, element)).to.equal(element);
    });
  });
});
