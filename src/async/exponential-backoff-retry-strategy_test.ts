import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { ExponentialBackoffRetryStrategy } from '../async';


describe('async.ExponentialBackoffRetryStrategy', () => {
  const MULTIPLIER = 2;
  const EXPONENT_BASE = 3;
  const MIN_TIME = 4;
  const MAX_TIME = 10;
  const RETRY_COUNT = 2;

  let strategy: ExponentialBackoffRetryStrategy;
  let mockWindow: any;

  beforeEach(() => {
    mockWindow = jasmine.createSpyObj('Window', ['setTimeout']);
    strategy = new ExponentialBackoffRetryStrategy(
        MULTIPLIER,
        EXPONENT_BASE,
        MIN_TIME,
        MAX_TIME,
        mockWindow,
        RETRY_COUNT);
  });

  describe('onReject', () => {
    it(`should resolve after the correct delay`, async () => {
      mockWindow.setTimeout.and.callFake((callback: any) => callback());
      spyOn(Math, 'random').and.returnValue(1 / 6);

      const newStrategy = await strategy.onReject();
      assert(newStrategy['retryCount_']).to.equal(RETRY_COUNT + 1);
      assert(mockWindow.setTimeout).to.haveBeenCalledWith(Matchers.anyFunction(), 7);
    });

    it(`should not exceed the max time`, async () => {
      mockWindow.setTimeout.and.callFake((callback: any) => callback());
      spyOn(Math, 'random').and.returnValue(1);

      const newStrategy = await strategy.onReject();
      assert(newStrategy['retryCount_']).to.equal(RETRY_COUNT + 1);
      assert(mockWindow.setTimeout).to.haveBeenCalledWith(Matchers.anyFunction(), MAX_TIME);
    });
  });
});
