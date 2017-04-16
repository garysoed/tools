import { assert, TestBase } from '../test-base';
TestBase.setup();

import { BaseListenableListener } from '../event/base-listenable-listener';
import { Mocks } from '../mock/mocks';
import { TestDispose } from '../testing/test-dispose';


describe('event.BaseListenableListener', () => {
  let listener: BaseListenableListener<string>;

  beforeEach(() => {
    listener = new BaseListenableListener<string>();
    TestDispose.add(listener);
  });

  describe('ctor', () => {
    it('should initialize correctly', () => {
      assert(listener['eventHandler_']['context_']).to.equal(listener);
    });
  });

  describe('listenTo', () => {
    it('should call the event handler correctly', () => {
      const listenable = Mocks.object('listenable');
      const eventType = 'eventType';
      const callback = Mocks.object('callback');
      const useCapture = true;
      const deregister = Mocks.object('deregister');

      spyOn(listener['eventHandler_'], 'listenTo').and.returnValue(deregister);

      assert(listener.listenTo(listenable, eventType, callback, useCapture)).to.equal(deregister);
      assert(listener['eventHandler_'].listenTo).to
          .haveBeenCalledWith(listenable, eventType, callback, useCapture);
    });
  });

  describe('unlistenFrom', () => {
    it('should call the event handler correctly', () => {
      const listenable = Mocks.object('listenable');
      const eventType = 'eventType';
      const callback = Mocks.object('callback');
      const useCapture = true;

      spyOn(listener['eventHandler_'], 'unlistenFrom');

      listener.unlistenFrom(listenable, eventType, callback, useCapture);
      assert(listener['eventHandler_'].unlistenFrom).to
          .haveBeenCalledWith(listenable, eventType, callback, useCapture);
    });
  });
});
