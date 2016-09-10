import {assert, TestBase, verify, verifyNoCalls} from '../test-base';
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

      listenable.dispatch(event, () => {});

      verifyNoCalls(mockCallback);
    });
  });

  describe('dispatch', () => {
    it('should call all the registered callbacks', () => {
      let event = 'event';
      let i = 0;
      let mockBubbleHandler = jasmine.createSpy('BubbleHandler');
      TestDispose.add(listenable.on(
          event,
          (payload: any) => {
            mockBubbleHandler(i, payload);
          },
          false));

      let mockCaptureHandler = jasmine.createSpy('CaptureHandler');
      TestDispose.add(listenable.on(
          event,
          (payload: any) => {
            mockCaptureHandler(i, payload);
          },
          true));

      let payload = Mocks.object('payload');

      listenable.dispatch(
          event,
          () => {
            i = i + 1;
          },
          payload);

      verify(mockCaptureHandler)(0, payload);
      verify(mockBubbleHandler)(1, payload);
    });

    it('should handle case when no callbacks are registered', () => {
      assert(() => {
        listenable.dispatch('event', () => {}, 'payload');
      }).toNot.throw();
    });
  });

  describe('on', () => {
    it('should return disposable function that stops listening to the event', () => {
      let mockCallback = jasmine.createSpy('Callback');
      let event = 'event';

      let disposableFunction = listenable.on(event, mockCallback);
      disposableFunction.dispose();

      listenable.dispatch(event, () => {});

      verifyNoCalls(mockCallback)();
    });
  });

  describe('once', () => {
    it('should listen to the event once', () => {
      let mockCallback = jasmine.createSpy('Callback');
      let event = 'event';

      let disposableFunction = listenable.once(event, mockCallback);
      listenable.dispatch(event, () => {});

      verify(mockCallback)(null);

      // Dispatch the event again.
      mockCallback.calls.reset();
      listenable.dispatch(event, () => {});
      verifyNoCalls(mockCallback)();
      assert(disposableFunction.isDisposed).to.equal(true);
    });

    it('should return disposable function that stops listening to the event', () => {
      let mockCallback = jasmine.createSpy('Callback');
      let event = 'event';

      let disposableFunction = listenable.once(event, mockCallback);
      disposableFunction.dispose();

      listenable.dispatch(event, () => {});

      verifyNoCalls(mockCallback);
    });
  });
});
