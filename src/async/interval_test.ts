import {assert, Matchers, TestBase} from '../test-base';
TestBase.setup();

import {Interval} from './interval';
import {TestDispose} from '../testing/test-dispose';


describe('async.Interval', () => {
  const INTERVAL = 100;
  let interval: Interval;

  beforeEach(() => {
    interval = Interval.newInstance(INTERVAL);
    TestDispose.add(interval);
  });

  describe('disposeInternal', () => {
    it('should stop the interval when disposed', () => {
      spyOn(interval, 'stop');

      interval.dispose();
      assert(interval.stop).to.haveBeenCalledWith();
    });
  });

  describe('start', () => {
    it('should start the interval and dispatch TICK events', () => {
      let callback = jasmine.createSpy('callback');
      let intervalId = 123;
      let spy = spyOn(window, 'setInterval').and.returnValue(intervalId);

      TestDispose.add(interval.on(Interval.TICK_EVENT, callback, this));
      interval.start();

      assert(interval['intervalId_']).to.equal(intervalId);
      assert(window.setInterval).to.haveBeenCalledWith(Matchers.any(Function), INTERVAL);

      spy.calls.argsFor(0)[0]();
      assert(callback).to.haveBeenCalledWith(null);
    });

    it('should throw error if the interval is already running', () => {
      interval['intervalId_'] = 123;

      assert(() => {
        interval.start();
      }).to.throwError(/is already running/);
    });
  });

  describe('stop', () => {
    it('should clear the interval', () => {
      let intervalId = 123;
      interval['intervalId_'] = intervalId;

      spyOn(window, 'clearInterval');

      interval.stop();
      assert(window.clearInterval).to.haveBeenCalledWith(intervalId);
    });

    it('should do nothing if the interval is already cleared', () => {
      interval['intervalId_'] = null;

      spyOn(window, 'clearInterval');

      interval.stop();
      assert(window.clearInterval).toNot.haveBeenCalled();
    });
  });
});
