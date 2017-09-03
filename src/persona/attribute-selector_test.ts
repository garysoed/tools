import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { NumberType, StringType } from '../check';
import { IntegerParser, StringParser } from '../parse';
import { attributeSelector } from '../persona';
import { ElementSelectorImpl } from '../persona/element-selector';

describe('persona.AttributeSelectorImpl', () => {
  describe('getValue', () => {
    it(`should return the correct value`, () => {
      const value = 123;
      const attrName = 'attr-name';
      const element = document.createElement('div');
      element.setAttribute(attrName, `${value}`);

      const mockElementSelector = jasmine.createSpyObj('ElementSelector', ['getValue']);
      mockElementSelector.getValue.and.returnValue(element);
      Object.setPrototypeOf(mockElementSelector, ElementSelectorImpl.prototype);

      const root = Mocks.object('root');

      const selector = attributeSelector(mockElementSelector, attrName, IntegerParser, NumberType);
      assert(selector.getValue(root)).to.equal(value);
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should return the default value if set`, () => {
      const value = 123;
      const attrName = 'attr-name';
      const element = document.createElement('div');

      const mockElementSelector = jasmine.createSpyObj('ElementSelector', ['getValue']);
      mockElementSelector.getValue.and.returnValue(element);
      Object.setPrototypeOf(mockElementSelector, ElementSelectorImpl.prototype);

      const root = Mocks.object('root');

      const selector = attributeSelector(
          mockElementSelector,
          attrName,
          IntegerParser,
          NumberType,
          value);
      assert(selector.getValue(root)).to.equal(value);
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(root);
    });
  });

  describe('setValue', () => {
    it(`should set the value correctly`, () => {
      const value = 123;
      const attrName = 'attr-name';
      const element = document.createElement('div');
      element.setAttribute(attrName, `oldValue`);

      const mockElementSelector = jasmine.createSpyObj('ElementSelector', ['getValue']);
      mockElementSelector.getValue.and.returnValue(element);
      Object.setPrototypeOf(mockElementSelector, ElementSelectorImpl.prototype);

      const root = Mocks.object('root');

      const selector = attributeSelector(mockElementSelector, attrName, IntegerParser, NumberType);
      selector.setValue(value, root);
      assert(element.getAttribute(attrName)).to.equal(`${value}`);
      assert(selector.getValue(root)).to.equal(value);
    });

    it(`should delete the attribute if the value is null`, () => {
      const attrName = 'attr-name';
      const element = document.createElement('div');
      element.setAttribute(attrName, `oldValue`);

      const mockElementSelector = jasmine.createSpyObj('ElementSelector', ['getValue']);
      mockElementSelector.getValue.and.returnValue(element);
      Object.setPrototypeOf(mockElementSelector, ElementSelectorImpl.prototype);

      const root = Mocks.object('root');

      const selector = attributeSelector(mockElementSelector, attrName, StringParser, StringType);
      selector.setValue(null, root);
      assert(element.hasAttribute(attrName)).to.beFalse();
    });
  });
});
