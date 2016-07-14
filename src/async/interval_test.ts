import TestBase from '../test-base';
TestBase.setup();

import Interval, { EventType as IntervalEventType } from './interval';
import {TestDispose} from '../testing/test-dispose';


describe('async.Interval', () => {
  const INTERVAL = 100;
  let interval;

  beforeEach(() => {
    interval = Interval.newInstance(INTERVAL);
    TestDispose.add(interval);
  });

  describe('disposeInternal', () => {
    it('should stop the interval when disposed', () => {
      spyOn(interval, 'stop');

      interval.dispose();
      expect(interval.stop).toHaveBeenCalledWith();
    });
  });

  describe('start', () => {
    it('should start the interval and dispatch TICK events', () => {
      let callback = jasmine.createSpy('callback');
      let intervalId = 'intervalId';
      let spy = spyOn(window, 'setInterval').and.returnValue(intervalId);

      TestDispose.add(interval.on(IntervalEventType.TICK, callback));
      interval.start();

      expect(interval['intervalId_']).toEqual(intervalId);
      expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), INTERVAL);

      spy.calls.argsFor(0)[0]();
      expect(callback).toHaveBeenCalledWith(null);
    });

    it('should throw error if the interval is already running', () => {
      interval['intervalId_'] = 123;

      expect(() => {
        interval.start();
      }).toThrowError(/is already running/);
    });
  });

  describe('stop', () => {
    it('should clear the interval', () => {
      let intervalId = 'intervalId';
      interval['intervalId_'] = intervalId;

      spyOn(window, 'clearInterval');

      interval.stop();
      expect(window.clearInterval).toHaveBeenCalledWith(intervalId);
    });

    it('should do nothing if the interval is already cleared', () => {
      interval['intervalId_'] = null;

      spyOn(window, 'clearInterval');

      interval.stop();
      expect(window.clearInterval).not.toHaveBeenCalled();
    });
  });
});
