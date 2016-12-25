import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Attributes} from './attributes';

describe('ui.Attributes', () => {
  describe('add', () => {
    it('should add the given attribute with the given value to the element', () => {
      let attrName = 'attr-name';
      let attrValue = 'attrValue';
      let el = document.createElement('div');
      let attr = Attributes.add(attrName, attrValue, el, document);

      assert(attr).to.equal(el.attributes.getNamedItem(attrName));
      assert(attr.value).to.equal(attrValue);
    });
  });
});
