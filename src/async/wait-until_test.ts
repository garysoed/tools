import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Interval } from '../async/interval';
import WaitUntil from '../async/wait-until';
import { Fakes } from '../mock/fakes';
import { Mocks } from '../mock/mocks';
import { TestDispose } from '../testing/test-dispose';



describe('async.WaitUntil', () => {
  const INTERVAL = 200;
  let mockCheckFn: any;
  let waitUntil: WaitUntil;

  beforeEach(() => {
    mockCheckFn = jasmine.createSpy('CheckFn');

    waitUntil = new WaitUntil(mockCheckFn, INTERVAL);
    TestDispose.add(waitUntil);
  });

  describe('onTick_', () => {
    it('should resolve when the check function returns true', () => {
      const mockInterval = jasmine.createSpyObj('Interval', ['dispose']);
      const mockResolve = jasmine.createSpy('Resolve');
      const mockReject = jasmine.createSpy('Reject');
      spyOn(waitUntil, 'isDisposed').and.returnValue(false);
      mockCheckFn.and.returnValue(true);

      waitUntil['onTick_'](mockInterval, mockResolve, mockReject);
      assert(mockResolve).to.haveBeenCalledWith();
      assert(mockInterval.dispose).to.haveBeenCalledWith();
    });

    it('should reject the promise when the waiter is disposed', () => {
      const mockInterval = jasmine.createSpyObj('Interval', ['dispose']);
      const mockResolve = jasmine.createSpy('Resolve');
      const mockReject = jasmine.createSpy('Reject');
      spyOn(waitUntil, 'isDisposed').and.returnValue(true);
      mockCheckFn.and.returnValue(true);

      waitUntil['onTick_'](mockInterval, mockResolve, mockReject);
      assert(mockReject).to.haveBeenCalledWith(jasmine.any(Error));

      const error: Error = mockReject.calls.argsFor(0)[0];
      assert(error.message).to.match(/has not returned/);

      assert(mockInterval.dispose).toNot.haveBeenCalled();
    });

    it('should do nothing if not disposed and check function returns false', () => {
      const mockInterval = jasmine.createSpyObj('Interval', ['dispose']);
      const mockResolve = jasmine.createSpy('Resolve');
      const mockReject = jasmine.createSpy('Reject');
      spyOn(waitUntil, 'isDisposed').and.returnValue(false);
      mockCheckFn.and.returnValue(false);

      waitUntil['onTick_'](mockInterval, mockResolve, mockReject);
      assert(mockResolve).toNot.haveBeenCalled();
      assert(mockReject).toNot.haveBeenCalled();
      assert(mockInterval.dispose).toNot.haveBeenCalled();
    });
  });

  describe('getPromise', () => {
    it('should create a new interval, listen to TICK_EVENT and start it', async () => {
      const mockInterval = jasmine.createSpyObj('Interval', ['dispose', 'on', 'start']);

      spyOn(Interval, 'newInstance').and.returnValue(mockInterval);
      Fakes.build(spyOn(waitUntil, 'onTick_')).call((_: any, resolve: any) => {
        resolve();
      });

      Fakes.build(mockInterval.on).call((_eventType: any, callback: any) => {
        callback();
      });

      const promise = waitUntil.getPromise();
      await promise;
      assert(waitUntil['promise_']).to.equal(promise);
      assert(mockInterval.start).to.haveBeenCalledWith();
      assert(mockInterval.on).to.haveBeenCalledWith('tick', Matchers.anyFunction(), waitUntil);
      mockInterval.on.calls.argsFor(0)[1]();
      assert(waitUntil['onTick_']).to
          .haveBeenCalledWith(mockInterval, jasmine.anything() as any, jasmine.anything() as any);
      assert(Interval.newInstance).to.haveBeenCalledWith(INTERVAL);
    });

    it('should use the cached promise if available', () => {
      const existingPromise = Mocks.object('existingPromise');
      spyOn(Interval, 'newInstance');
      waitUntil['promise_'] = existingPromise;
      assert(waitUntil.getPromise()).to.equal(existingPromise);
      assert(Interval.newInstance).toNot.haveBeenCalled();
    });
  });
});
