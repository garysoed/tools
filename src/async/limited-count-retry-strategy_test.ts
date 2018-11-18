import { assert, should } from 'gs-testing/export/main';
import { LimitedCountRetryStrategy } from './limited-count-retry-strategy';

describe('async.LimitedCountRetryStrategy', () => {
  const MAX_RETRY = 2;
  let strategy: LimitedCountRetryStrategy;

  beforeEach(() => {
    strategy = new LimitedCountRetryStrategy(MAX_RETRY);
  });

  describe('onReject', () => {
    should(`resolve with the correct strategy`, async () => {
      const newStrategy = await strategy.onReject();
      // tslint:disable-next-line:no-non-null-assertion
      assert(newStrategy!['maxRetry_']).to.equal(MAX_RETRY - 1);
    });

    should(`resolve with null if max retry is 0`, async () => {
      const newStrategy = await (new LimitedCountRetryStrategy(0)).onReject();
      assert(newStrategy).to.beNull();
    });
  });
});
