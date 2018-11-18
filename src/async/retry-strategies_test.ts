import { assert, should } from 'gs-testing/export/main';
import { mocks } from 'gs-testing/export/mock';
import { createSpyObject, fake, SpyObj } from 'gs-testing/export/spy';
import { AllRetryStrategy } from '../async/retry-strategies';
import { ImmutableSet } from '../immutable';
import { RetryStrategy } from './retry-strategy';


describe('async.AllRetryStrategy', () => {
  let strategy: AllRetryStrategy;
  let mockSubStrategy1: SpyObj<RetryStrategy>;
  let mockSubStrategy2: SpyObj<RetryStrategy>;

  beforeEach(() => {
    mockSubStrategy1 = createSpyObject('SubStrategy1', ['onReject']);
    mockSubStrategy2 = createSpyObject('SubStrategy2', ['onReject']);
    strategy = new AllRetryStrategy(ImmutableSet.of([mockSubStrategy1, mockSubStrategy2]));
  });

  describe('onReject', () => {
    should(`resolve with correct strategy`, async () => {
      const error = mocks.object('error');
      const newSubStrategy1 = mocks.object<RetryStrategy>('newSubStrategy1');
      fake(mockSubStrategy1.onReject).always().return(Promise.resolve(newSubStrategy1));
      const newSubStrategy2 = mocks.object<RetryStrategy>('newSubStrategy2');
      fake(mockSubStrategy2.onReject).always().return(Promise.resolve(newSubStrategy2));

      const newStrategy = (await strategy.onReject(error)) as AllRetryStrategy;
      assert(newStrategy['strategies_']).to.haveElements([newSubStrategy1, newSubStrategy2]);
      assert(mockSubStrategy1.onReject).to.haveBeenCalledWith(error);
      assert(mockSubStrategy2.onReject).to.haveBeenCalledWith(error);
    });

    should(`resolve with null if one of the substrategies resolves with null`, async () => {
      const error = mocks.object('error');
      const newSubStrategy1 = mocks.object<RetryStrategy>('newSubStrategy1');
      fake(mockSubStrategy1.onReject).always().return(Promise.resolve(newSubStrategy1));
      fake(mockSubStrategy2.onReject).always().return(Promise.resolve(null));

      const newStrategy = await strategy.onReject(error);
      assert(newStrategy).to.beNull();
      assert(mockSubStrategy1.onReject).to.haveBeenCalledWith(error);
      assert(mockSubStrategy2.onReject).to.haveBeenCalledWith(error);
    });
  });
});
