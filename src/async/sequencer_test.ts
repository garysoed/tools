import { assert, TestBase } from '../test-base';
TestBase.setup();

import { TestDispose } from '../testing/test-dispose';

import { Mocks } from '../mock/mocks';
import { Sequencer } from './sequencer';


describe('async.Sequencer', () => {
  let sequencer: Sequencer;

  beforeEach(() => {
    sequencer = new Sequencer();
    TestDispose.add(sequencer);
  });

  describe('run', () => {
    let mockOperation: any;

    beforeEach(() => {
      mockOperation = jasmine.createSpy('Operation');
    });

    it('should return promise that is ran after the operation has completed', async () => {
      mockOperation.and.returnValue(Promise.resolve());
      await sequencer.run(mockOperation);
      assert(mockOperation).to.haveBeenCalledWith();
    });

    it('should not run the operation if the sequencer is disposed', async () => {
      sequencer.dispose();
      await sequencer.run(mockOperation);
      assert(mockOperation).toNot.haveBeenCalled();
    });

    it('should return promise that is ran after the operation has rejected', async () => {
      const error = Mocks.object('error');
      mockOperation.and.returnValue(Promise.reject(error));
      try {
        await sequencer.run(mockOperation);
      } catch (e) {
        assert(e).to.equal(error);
      }
      assert(mockOperation).to.haveBeenCalledWith();
    });
  });
});
