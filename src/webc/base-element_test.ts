import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ListenableDom } from '../event/listenable-dom';
import { Mocks } from '../mock/mocks';
import { TestDispose } from '../testing/test-dispose';

import { BaseElement } from './base-element';


describe('webc.BaseElement', () => {
  let baseElement: BaseElement;

  beforeEach(() => {
    baseElement = new BaseElement();
    TestDispose.add(baseElement);
  });

  describe('onCreated', () => {
    it('should create the listenable element', () => {
      const element = Mocks.object('element');
      const mockListenable = Mocks.listenable('listenableElement');
      spyOn(ListenableDom, 'of').and.returnValue(mockListenable);

      baseElement.onCreated(element);

      assert(baseElement.getElement()).to.equal(mockListenable);
      assert(ListenableDom.of).to.haveBeenCalledWith(element);
    });
  });
});
