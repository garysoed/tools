import { assert, TestBase } from '../test-base';
TestBase.setup();

import { LimitedCountRetryStrategy } from '../async';


describe('async.LimitedCountRetryStrategy', () => {
  const MAX_RETRY = 2;
  let strategy: LimitedCountRetryStrategy;

  beforeEach(() => {
    strategy = new LimitedCountRetryStrategy(MAX_RETRY);
  });

  describe('onReject', () => {
    it(`should resolve with the correct strategy`, async () => {
      const newStrategy = await strategy.onReject();
      assert(newStrategy!['maxRetry_']).to.equal(MAX_RETRY - 1);
    });

    it(`should resolve with null if max retry is 0`, async () => {
      const newStrategy = await (new LimitedCountRetryStrategy(0)).onReject();
      assert(newStrategy).to.beNull();
    });
  });
});
