import { TestBase } from '../test-base';
TestBase.setup();

import { assert, Match } from 'gs-testing/export/main';
import { Interval } from '../async/interval';
import { TestDispose } from '../dispose/testing/test-dispose';


describe('async.Interval', () => {
  const INTERVAL = 100;
  let interval: Interval;

  beforeEach(() => {
    interval = new Interval(INTERVAL);
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
      const intervalId = 123;
      const spy = spyOn(window, 'setInterval').and.returnValue(intervalId);
      spyOn(interval, 'dispatch');
      interval.start();

      assert(interval['intervalId_']).to.equal(intervalId);
      assert(window.setInterval).to.haveBeenCalledWith(Match.anyFunction(), INTERVAL);

      spy.calls.argsFor(0)[0]();
      assert(interval.dispatch).to.haveBeenCalledWith({type: 'tick'});
    });

    it('should throw error if the interval is already running', () => {
      interval['intervalId_'] = 123;

      assert(() => {
        interval.start();
      }).to.throwError(/not be running/);
    });
  });

  describe('stop', () => {
    it('should clear the interval', () => {
      const intervalId = 123;
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
