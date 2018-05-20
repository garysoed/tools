import { assert, TestBase } from '../test-base';
TestBase.setup();

import { mockObject } from 'gs-testing/export/mock';
import { TestDispose } from '../testing/test-dispose';
import { BaseListenable } from './base-listenable';


describe('event.BaseListenable', () => {
  let listenable: BaseListenable<string>;

  beforeEach(() => {
    listenable = new BaseListenable<string>();
    TestDispose.add(listenable);
  });

  describe('dispose', () => {
    it('should clear the callback map', () => {
      const mockCallback = jasmine.createSpy('Callback');
      const event = 'event';
      TestDispose.add(listenable.on(event, mockCallback, window));
      listenable.dispose();

      listenable.dispatch(event, () => undefined);

      assert(mockCallback).toNot.haveBeenCalled();
    });
  });

  describe('dispatch', () => {
    it('should call all the registered callbacks', () => {
      const event = 'event';
      let i = 0;
      const mockBubbleHandler = jasmine.createSpy('BubbleHandler');
      TestDispose.add(listenable.on(
          event,
          (eventPayload: any) => {
            mockBubbleHandler(i, eventPayload);
          },
          window,
          false));

      const mockCaptureHandler = jasmine.createSpy('CaptureHandler');
      TestDispose.add(listenable.on(
          event,
          (eventPayload: any) => {
            mockCaptureHandler(i, eventPayload);
          },
          window,
          true));

      const payload = mockObject('payload');

      listenable.dispatch(
          event,
          () => {
            i = i + 1;
          },
          payload);

      assert(mockCaptureHandler).to.haveBeenCalledWith(0, payload);
      assert(mockBubbleHandler).to.haveBeenCalledWith(1, payload);
    });

    it('should handle case when no callbacks are registered', () => {
      assert(() => {
        listenable.dispatch('event', () => undefined, 'payload');
      }).toNot.throw();
    });
  });

  describe('dispatchAsync', () => {
    it('should call all the registered callbacks', async () => {
      const event = 'event';
      let i = 0;
      const mockBubbleHandler = jasmine.createSpy('BubbleHandler');
      TestDispose.add(listenable.on(
          event,
          (eventPayload: any) => {
            mockBubbleHandler(i, eventPayload);
          },
          window,
          false));

      const mockCaptureHandler = jasmine.createSpy('CaptureHandler');
      TestDispose.add(listenable.on(
          event,
          (eventPayload: any) => {
            mockCaptureHandler(i, eventPayload);
          },
          window,
          true));

      const payload = mockObject('payload');

      const promise = listenable.dispatchAsync(
          event,
          async () => {
            i = i + 1;
          },
          payload);

      assert(mockCaptureHandler).to.haveBeenCalledWith(0, payload);
      assert(mockBubbleHandler).toNot.haveBeenCalled();

      await promise;

      assert(mockBubbleHandler).to.haveBeenCalledWith(1, payload);
    });

    it('should handle case when no callbacks are registered', () => {
      assert(() => {
        listenable.dispatch('event', () => undefined, 'payload');
      }).toNot.throw();
    });
  });

  describe('on', () => {
    it('should return disposable function that stops listening to the event', () => {
      const mockCallback = jasmine.createSpy('Callback');
      const event = 'event';

      const disposableFunction = listenable.on(event, mockCallback, window);
      disposableFunction.dispose();

      listenable.dispatch(event, () => undefined);

      assert(mockCallback).toNot.haveBeenCalled();
    });
  });

  describe('once', () => {
    it('should listen to the event once', () => {
      const mockCallback = jasmine.createSpy('Callback');
      const event = 'event';

      const disposableFunction = listenable.once(event, mockCallback, window);
      listenable.dispatch(event, () => undefined);

      assert(mockCallback).to.haveBeenCalledWith(null);

      // Dispatch the event again.
      mockCallback.calls.reset();
      listenable.dispatch(event, () => undefined);
      assert(mockCallback).toNot.haveBeenCalled();
      assert(disposableFunction.isDisposed() as boolean).to.beTrue();
    });

    it('should return disposable function that stops listening to the event', () => {
      const mockCallback = jasmine.createSpy('Callback');
      const event = 'event';

      const disposableFunction = listenable.once(event, mockCallback, window);
      disposableFunction.dispose();

      listenable.dispatch(event, () => undefined);

      assert(mockCallback).toNot.haveBeenCalled();
    });
  });
});
