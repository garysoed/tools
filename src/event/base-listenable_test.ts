import {TestBase} from '../test-base';
TestBase.setup();

import {BaseListenable} from './base-listenable';
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

  describe('once', () => {
    it('should listen to the event once', () => {
      let mockCallback = jasmine.createSpy('Callback');
      let event = 'event';

      let disposableFunction = listenable.once(event, mockCallback);
      listenable.dispatch(event);

      expect(mockCallback).toHaveBeenCalledWith(null);

      // Dispatch the event again.
      mockCallback.calls.reset();
      listenable.dispatch(event);
      expect(mockCallback).not.toHaveBeenCalled();
      expect(disposableFunction.isDisposed).toEqual(true);
    });

    it('should return disposable function that stops listening to the event', () => {
      let mockCallback = jasmine.createSpy('Callback');
      let event = 'event';

      let disposableFunction = listenable.once(event, mockCallback);
      disposableFunction.dispose();

      listenable.dispatch(event);

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });
});
