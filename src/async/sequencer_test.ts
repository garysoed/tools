import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Sequencer} from './sequencer';
import {TestDispose} from '../testing/test-dispose';


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

    it('should return promise that is ran after the operation has completed', (done: any) => {
      mockOperation.and.returnValue(Promise.resolve());
      sequencer.run(mockOperation)
          .then(() => {
            assert(mockOperation).to.haveBeenCalledWith();
            done();
          }, done.fail);
    });

    it('should not run the operation if the sequencer is disposed', (done: any) => {
      sequencer.dispose();
      sequencer.run(mockOperation)
          .then(() => {
            assert(mockOperation).toNot.haveBeenCalled();
            done();
          }, done.fail);
    });
  });
});
