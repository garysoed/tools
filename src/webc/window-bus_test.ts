import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Bus } from '../event/bus';
import { Mocks } from '../mock/mocks';
import { TestDispose } from '../testing/test-dispose';
import { WindowBus } from '../webc/window-bus';


describe('webc.WindowBus', () => {
  let bus: WindowBus;

  beforeEach(() => {
    bus = new WindowBus(window, Mocks.object('Log'));
    TestDispose.add(bus);
  });

  describe('on', () => {
    it('should listen to window event correctly', () => {
      const eventType = 'eventType';
      const callback = Mocks.object('callback');
      const context = Mocks.object('context');
      const useCapture = true;
      const disposableFunction = Mocks.object('disposableFunction');

      spyOn(Bus.prototype, 'on').and.returnValue(disposableFunction);
      spyOn(bus, 'dispatch');
      const spyListenedWindowOn = spyOn(bus['listenableWindow_'], 'on')
          .and.returnValue({dispose: () => { }});

      assert(bus.on(eventType, callback, context, useCapture)).to.equal(disposableFunction);
      assert(Bus.prototype.on).to.haveBeenCalledWith(eventType, callback, context, useCapture);
      assert(bus['listenedEvents_']).to.haveElements([eventType]);
      assert(bus['listenableWindow_'].on).to.haveBeenCalledWith(
          eventType,
          Matchers.any(Function) as any,
          bus);
      spyListenedWindowOn.calls.argsFor(0)[1]();
      assert(bus.dispatch).to.haveBeenCalledWith({type: eventType});
    });

    it('should not listen to the window event if already listened to', () => {
      const eventType = 'eventType';
      const callback = Mocks.object('callback');
      const context = Mocks.object('context');
      const useCapture = true;
      const disposableFunction = Mocks.object('disposableFunction');

      spyOn(Bus.prototype, 'on').and.returnValue(disposableFunction);
      spyOn(bus, 'dispatch');
      spyOn(bus['listenableWindow_'], 'on');

      bus['listenedEvents_'].add(eventType);

      assert(bus.on(eventType, callback, context, useCapture)).to.equal(disposableFunction);
      assert(Bus.prototype.on).to.haveBeenCalledWith(eventType, callback, context, useCapture);
      assert(bus['listenedEvents_']).to.haveElements([eventType]);
      assert(bus['listenableWindow_'].on).toNot.haveBeenCalled();
    });
  });
});
