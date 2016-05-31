import TestBase from '../test-base';
TestBase.setup();

import {Attributes} from './attributes';

describe('ui.Attributes', () => {
  describe('add', () => {
    it('should add the given attribute with the given value to the element', () => {
      let attrName = 'attr-name';
      let attrValue = 'attrValue';
      let el = document.createElement('div');
      let attr = Attributes.add(attrName, attrValue, el, document);

      expect(attr).toEqual(el.attributes.getNamedItem(attrName));
      expect(attr.value).toEqual(attrValue);
    });
  });
});
