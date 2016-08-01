import {TestBase} from '../test-base';
TestBase.setup();

import {BaseElement} from './base-element';
import {ListenableDom} from '../event/listenable-dom';
import {Mocks} from '../mock/mocks';
import {TestDispose} from '../testing/test-dispose';


describe('webc.BaseElement', () => {
  let baseElement;

  beforeEach(() => {
    baseElement = new BaseElement();
    TestDispose.add(baseElement);
  });

  describe('onCreated', () => {
    fit('should create the listenable element', () => {
      let element = Mocks.object('element');
      let listenableElement = Mocks.disposable('element');

      spyOn(ListenableDom, 'of').and.returnValue(listenableElement);

      baseElement.onCreated(element);

      expect(baseElement.element).toEqual(listenableElement);
      expect(ListenableDom.of).toHaveBeenCalledWith(element);
    });
  });
});
