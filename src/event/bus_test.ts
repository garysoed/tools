import { assert, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { Bus } from '../event/bus';
import { TestDispose } from '../testing/test-dispose';
import { Log } from '../util/log';


describe('event.Bus', () => {
  let bus: Bus<any, any>;

  beforeEach(() => {
    bus = new Bus<any, any>(Log.of('event.TestBus'));
    TestDispose.add(bus);
  });

  describe('dispatch', () => {
    should('call all the registered callbacks', () => {
      const eventType = 'testevent';
      const event = {type: eventType};
      let i = 0;
      const mockBubbleHandler = createSpy('BubbleHandler');
      TestDispose.add(bus.on(
          eventType,
          (payload: any) => {
            mockBubbleHandler(i, payload);
          },
          window,
          false));

      const mockCaptureHandler = createSpy('CaptureHandler');
      TestDispose.add(bus.on(
          eventType,
          (payload: any) => {
            mockCaptureHandler(i, payload);
          },
          window,
          true));

      bus.dispatch(
          event,
          () => {
            i = i + 1;
          });

      assert(mockCaptureHandler).to.haveBeenCalledWith(0, event);
      assert(mockBubbleHandler).to.haveBeenCalledWith(1, event);
    });

    should('handle case when no callbacks are registered', () => {
      assert(() => {
        bus.dispatch('event', () => undefined);
      }).toNot.throw();
    });

    should('not throw error if one of the handlers throws', () => {
      const eventType = 'testevent';
      const event = {type: eventType};
      TestDispose.add(bus.on(
          eventType,
          () => {
            throw new Error('Expected error');
          },
          window,
          false));

      assert(() => {
        bus.dispatch(event);
      }).toNot.throw();
    });
  });

  describe('on', () => {
    should('return disposable function that stops listening to the event', () => {
      const mockCallback = createSpy('Callback');
      const event = 'event';

      const disposableFunction = bus.on(event, mockCallback, window);
      disposableFunction.dispose();

      bus.dispatch(event);

      assert(mockCallback).toNot.haveBeenCalled();
    });
  });
});
