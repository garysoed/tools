import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Interval} from '../async/interval';
import {TestDispose} from '../testing/test-dispose';
import WaitUntil from './wait-until';


describe('async.WaitUntil', () => {
  const INTERVAL = 200;
  let mockCheckFn;
  let mockInterval;
  let waitUntil;

  beforeEach(() => {
    mockCheckFn = jasmine.createSpy('CheckFn');
    mockInterval = jasmine.createSpyObj('Interval', ['dispose', 'on', 'start']);

    spyOn(Interval, 'newInstance').and.returnValue(mockInterval);

    waitUntil = new WaitUntil(mockCheckFn, INTERVAL);
    TestDispose.add(waitUntil);
  });

  it('should resolve the promise when the check function returns true', (done: any) => {
    waitUntil.promise
        .then(() => {
          assert(Interval.newInstance).to.haveBeenCalledWith(INTERVAL);
          assert(mockInterval.dispose).to.haveBeenCalledWith();
          done();
        }, done.fail);

    assert(mockInterval.start).to.haveBeenCalledWith();
    assert(mockInterval.on).to.haveBeenCalledWith(Interval.TICK_EVENT, <any> jasmine.any(Function));
    mockCheckFn.and.returnValue(true);

    mockInterval.on.calls.argsFor(0)[1]();
  });

  it('should reject the promise when the waiter is disposed', (done: any) => {
    waitUntil.promise
        .then(done.fail, (error: string) => {
          assert(error).to.match(/has not returned/);
          done();
        });

    waitUntil.dispose();
    mockInterval.on.calls.argsFor(0)[1]();
  });
});
