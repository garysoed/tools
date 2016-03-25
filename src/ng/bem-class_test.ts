import TestBase from '../test-base';
TestBase.setup();

import Arrays from '../collection/arrays';
import Attributes from '../ui/attributes';
import { BemClassCtrl } from './bem-class';


describe('ng.BemClassCtrl', () => {
  let ctrl;

  beforeEach(() => {
    ctrl = new BemClassCtrl();
  });

  describe('onLink', () => {
    it('should add all CSS classes with BEM style', () => {
      let bemRootClass = 'bemRoot';
      let bemRootEl = document.createElement('div');
      Attributes.add('gs-bem-root', bemRootClass, bemRootEl, document);

      let parentEl = document.createElement('div');
      bemRootEl.appendChild(parentEl);

      let el = document.createElement('div');
      parentEl.appendChild(el);

      let class1 = 'class1';
      let class2 = 'class2';

      ctrl.onLink(`${class1} ${class2}`, el);

      expect(Arrays.fromNumericalIndexed(el.classList).data).toEqual([
        `${bemRootClass}__${class1}`,
        `${bemRootClass}__${class2}`,
      ]);
    });

    it('should throw error if the bem-root cannot be found', () => {
      let el = document.createElement('div');

      expect(() => {
        ctrl.onLink('class1 class2', el);
      }).toThrowError(/Cannot find ancestor element/);
    });
  });
});
