import { assert, should } from 'gs-testing/export/main';
import { mocks } from 'gs-testing/export/mock';
import { createSpy, fake, Spy } from 'gs-testing/export/spy';
import { TestDispose } from '../dispose/testing/test-dispose';
import { Sequencer } from './sequencer';


describe('async.Sequencer', () => {
  let sequencer: Sequencer;

  beforeEach(() => {
    sequencer = new Sequencer();
    TestDispose.add(sequencer);
  });

  describe('run', () => {
    let mockOperation: Spy<Promise<any>, []>;

    beforeEach(() => {
      mockOperation = createSpy('Operation');
    });

    should(`return promise that is ran after the operation has completed`, async () => {
      fake(mockOperation).always().return(Promise.resolve());
      await sequencer.run(mockOperation);
      assert(mockOperation).to.haveBeenCalledWith();
    });

    should(`not run the operation if the sequencer is disposed`, async () => {
      sequencer.dispose();
      await sequencer.run(mockOperation);
      assert(mockOperation).toNot.haveBeenCalled();
    });

    should(`return promise that is ran after the operation has rejected`, async () => {
      const error = mocks.object('error');
      fake(mockOperation).always().return(Promise.reject(error));
      try {
        await sequencer.run(mockOperation);
      } catch (e) {
        assert(e).to.equal(error);
      }
      assert(mockOperation).to.haveBeenCalledWith();
    });
  });
});
