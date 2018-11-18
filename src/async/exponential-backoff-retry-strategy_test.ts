import { assert, match, should } from 'gs-testing/export/main';
import { createSpyObject, fake, spy, SpyObj } from 'gs-testing/export/spy';
import { ExponentialBackoffRetryStrategy } from './exponential-backoff-retry-strategy';

describe('async.ExponentialBackoffRetryStrategy', () => {
  const MULTIPLIER = 2;
  const EXPONENT_BASE = 3;
  const MIN_TIME = 4;
  const MAX_TIME = 10;
  const RETRY_COUNT = 2;

  let strategy: ExponentialBackoffRetryStrategy;
  let mockWindow: SpyObj<Window>;

  beforeEach(() => {
    mockWindow = createSpyObject('Window', ['setTimeout']);
    strategy = new ExponentialBackoffRetryStrategy(
        MULTIPLIER,
        EXPONENT_BASE,
        MIN_TIME,
        MAX_TIME,
        mockWindow,
        RETRY_COUNT);
  });

  describe('onReject', () => {
    should(`resolve after the correct delay`, async () => {
      fake(mockWindow.setTimeout).always().call((callback: any) => callback());
      fake(spy(Math, 'random')).always().return(1 / 6);

      const newStrategy = await strategy.onReject();
      assert(newStrategy['retryCount_']).to.equal(RETRY_COUNT + 1);
      assert(mockWindow.setTimeout).to
          .haveBeenCalledWith(match.anyObjectThat().beAnInstanceOf(Function), 7);
    });

    should(`not exceed the max time`, async () => {
      fake(mockWindow.setTimeout).always().call((callback: any) => callback());
      fake(spy(Math, 'random')).always().return(1);

      const newStrategy = await strategy.onReject();
      assert(newStrategy['retryCount_']).to.equal(RETRY_COUNT + 1);
      assert(mockWindow.setTimeout).to
          .haveBeenCalledWith(match.anyObjectThat().beAnInstanceOf(Function), MAX_TIME);
    });
  });
});
