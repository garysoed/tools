import {assert, TestBase} from '../test-base';
TestBase.setup();

import {TestDispose} from '../testing/test-dispose';

import {Sequencer} from './sequencer';


describe('async.Sequencer', () => {
  let sequencer;

  beforeEach(() => {
    sequencer = Sequencer.newInstance();
    TestDispose.add(sequencer);
  });

  describe('run', () => {
    let mockOperation;

    beforeEach(() => {
      mockOperation = jasmine.createSpy('Operation');
    });

    it('should return promise that is ran after the operation has completed', async (done: any) => {
      mockOperation.and.returnValue(Promise.resolve());
      await sequencer.run(mockOperation);
      assert(mockOperation).to.haveBeenCalledWith();
    });

    it('should not run the operation if the sequencer is disposed', async (done: any) => {
      sequencer.dispose();
      await sequencer.run(mockOperation);
      assert(mockOperation).toNot.haveBeenCalled();
    });
  });
});
