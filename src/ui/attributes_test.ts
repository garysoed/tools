import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Attributes } from './attributes';

describe('ui.Attributes', () => {
  describe('add', () => {
    it('should add the given attribute with the given value to the element', () => {
      const attrName = 'attr-name';
      const attrValue = 'attrValue';
      const el = document.createElement('div');
      const attr = Attributes.add(attrName, attrValue, el, document);

      assert(attr).to.equal(el.attributes.getNamedItem(attrName));
      assert(attr.value).to.equal(attrValue);
    });
  });
});
