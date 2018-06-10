import { TestBase } from '../test-base';
TestBase.setup();

import { assert } from 'gs-testing/export/main';
import { TestDispose } from '../dispose/testing/test-dispose';
import { WaitUntil } from './wait-until';


describe('async.WaitUntil', () => {
  const INTERVAL = 200;
  let mockCheckFn: any;
  let waitUntil: WaitUntil;

  beforeEach(() => {
    mockCheckFn = jasmine.createSpy('CheckFn');

    waitUntil = new WaitUntil(mockCheckFn, INTERVAL);
    TestDispose.add(waitUntil);
  });

  describe('getPromise', () => {
    it(`should create a new interval, keep checking it until it returns true, and stops`,
        async () => {
      mockCheckFn.and.returnValues(false, false, true);

      await waitUntil.getPromise();
      assert(mockCheckFn).to.haveBeenCalledTimes(3);
    });
  });
});
