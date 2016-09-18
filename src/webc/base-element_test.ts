import {assert, TestBase} from '../test-base';
TestBase.setup();

import {BaseElement} from './base-element';
import {Mocks} from '../mock/mocks';
import {TestDispose} from '../testing/test-dispose';
import {TestListenableDom} from '../testing/test-listenable-dom';


describe('webc.BaseElement', () => {
  let baseElement;

  beforeEach(() => {
    baseElement = new BaseElement();
    TestDispose.add(baseElement);
  });

  describe('onCreated', () => {
    it('should create the listenable element', () => {
      let element = Mocks.object('element');

      baseElement.onCreated(element);

      assert(baseElement.element).to.equal(TestListenableDom.getListenable(element));
    });
  });
});
