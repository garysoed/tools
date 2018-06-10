import { TestBase } from '../test-base';
TestBase.setup();

import { assert } from 'gs-testing/export/main';
import { Mocks } from 'gs-testing/export/mock';
import { AllRetryStrategy } from '../async/retry-strategies';
import { ImmutableSet } from '../immutable';


describe('async.AllRetryStrategy', () => {
  let strategy: AllRetryStrategy;
  let mockSubStrategy1: any;
  let mockSubStrategy2: any;

  beforeEach(() => {
    mockSubStrategy1 = jasmine.createSpyObj('SubStrategy1', ['onReject']);
    mockSubStrategy2 = jasmine.createSpyObj('SubStrategy2', ['onReject']);
    strategy = new AllRetryStrategy(ImmutableSet.of([mockSubStrategy1, mockSubStrategy2]));
  });

  describe('onReject', () => {
    it(`should resolve with correct strategy`, async () => {
      const error = Mocks.object('error');
      const newSubStrategy1 = Mocks.object('newSubStrategy1');
      mockSubStrategy1.onReject.and.returnValue(Promise.resolve(newSubStrategy1));
      const newSubStrategy2 = Mocks.object('newSubStrategy2');
      mockSubStrategy2.onReject.and.returnValue(Promise.resolve(newSubStrategy2));

      const newStrategy = (await strategy.onReject(error)) as AllRetryStrategy;
      assert(newStrategy['strategies_']).to.haveElements([newSubStrategy1, newSubStrategy2]);
      assert(mockSubStrategy1.onReject).to.haveBeenCalledWith(error);
      assert(mockSubStrategy2.onReject).to.haveBeenCalledWith(error);
    });

    it(`should resolve with null if one of the substrategies resolves with null`, async () => {
      const error = Mocks.object('error');
      const newSubStrategy1 = Mocks.object('newSubStrategy1');
      mockSubStrategy1.onReject.and.returnValue(Promise.resolve(newSubStrategy1));
      mockSubStrategy2.onReject.and.returnValue(Promise.resolve(null));

      const newStrategy = await strategy.onReject(error);
      assert(newStrategy).to.beNull();
      assert(mockSubStrategy1.onReject).to.haveBeenCalledWith(error);
      assert(mockSubStrategy2.onReject).to.haveBeenCalledWith(error);
    });
  });
});
