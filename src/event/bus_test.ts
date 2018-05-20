import { assert, TestBase } from '../test-base';
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
    it('should call all the registered callbacks', () => {
      const eventType = 'testevent';
      const event = {type: eventType};
      let i = 0;
      const mockBubbleHandler = jasmine.createSpy('BubbleHandler');
      TestDispose.add(bus.on(
          eventType,
          (payload: any) => {
            mockBubbleHandler(i, payload);
          },
          window,
          false));

      const mockCaptureHandler = jasmine.createSpy('CaptureHandler');
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

    it('should handle case when no callbacks are registered', () => {
      assert(() => {
        bus.dispatch('event', () => undefined);
      }).toNot.throw();
    });

    it('should not throw error if one of the handlers throws', () => {
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
    it('should return disposable function that stops listening to the event', () => {
      const mockCallback = jasmine.createSpy('Callback');
      const event = 'event';

      const disposableFunction = bus.on(event, mockCallback, window);
      disposableFunction.dispose();

      bus.dispatch(event);

      assert(mockCallback).toNot.haveBeenCalled();
    });
  });
});
