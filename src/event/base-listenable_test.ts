import TestBase from '../test-base';
TestBase.setup();

import Asyncs from '../async/asyncs';
import BaseListenable from './base-listenable';
import {Mocks} from '../mock/mocks';
import {TestDispose} from '../testing/test-dispose';


describe('event.BaseListenable', () => {
  let listenable;

  beforeEach(() => {
    listenable = new BaseListenable<string>();
    TestDispose.add(listenable);
  });

  describe('dispose', () => {
    it('should clear the callback map', () => {
      let mockCallback = jasmine.createSpy('Callback');
      let event = 'event';
      TestDispose.add(listenable.on(event, mockCallback));
      listenable.dispose();

      listenable.dispatch(event);

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('dispatch', () => {
    it('should call all the registered callbacks', () => {
      let mockCallback = jasmine.createSpy('Callback');
      let event = 'event';
      let payload = Mocks.object('payload');
      TestDispose.add(listenable.on(event, mockCallback));

      listenable.dispatch(event, payload);

      expect(Asyncs.run).toHaveBeenCalledWith(jasmine.any(Function));
      expect(mockCallback).toHaveBeenCalledWith(payload);
    });

    it('should handle case when no callbacks are registered', () => {
      expect(() => {
        listenable.dispatch('event', 'payload');
      }).not.toThrow();
    });
  });

  describe('on', () => {
    it('should return disposable function that stops listening to the event', () => {
      let mockCallback = jasmine.createSpy('Callback');
      let event = 'event';

      let disposableFunction = listenable.on(event, mockCallback);
      disposableFunction.dispose();

      listenable.dispatch(event);

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });
});
