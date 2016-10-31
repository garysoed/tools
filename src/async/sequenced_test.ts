import {assert, Matchers, TestBase} from '../test-base';
TestBase.setup();

import {BaseDisposable} from '../dispose/base-disposable';
import {Mocks} from '../mock/mocks';
import {sequenced, __SEQUENCER} from './sequenced';
import {Sequencer} from './sequencer';


describe('async.sequenced', () => {
  let decorator;

  beforeEach(() => {
    decorator = sequenced();
  });

  it('should replace the descriptor with a function that sequence the annotated function',
      (done: any) => {
        class Class extends BaseDisposable {}

        let mockFunction = jasmine.createSpy('Function');

        let property = 'property';
        let descriptor = Mocks.object('descriptor');
        descriptor.value = mockFunction;

        let mockSequencer = jasmine.createSpyObj('Sequencer', ['dispose', 'run']);
        mockSequencer.run.and.returnValue(Promise.resolve());
        spyOn(Sequencer, 'newInstance').and.returnValue(mockSequencer);

        let newDescriptor = decorator(Class.prototype, property, descriptor);
        assert(newDescriptor).to.equal(descriptor);

        let mockInstance = jasmine.createSpyObj('Instance', ['addDisposable']);
        descriptor.value.call(mockInstance, 1, 2)
            .then(() => {
              assert(mockSequencer.run).to.haveBeenCalledWith(Matchers.any(Function));
              mockSequencer.run.calls.argsFor(0)[0]();

              assert(mockFunction).to.haveBeenCalledWith(1, 2);
              done();
            }, done.fail);
      });

  it('should reuse existing sequencer', (done: any) => {
    class Class extends BaseDisposable {}

    let descriptor = Mocks.object('descriptor');
    descriptor.value = () => {};

    let mockSequencer = jasmine.createSpyObj('Sequencer', ['run']);
    mockSequencer.run.and.returnValue(Promise.resolve());

    let instance = Mocks.object('instance');
    instance[__SEQUENCER] = mockSequencer;
    decorator(Class.prototype, 'property', descriptor).value.call(instance, 1, 2)
        .then(() => {
          assert(mockSequencer.run).to.haveBeenCalledWith(Matchers.any(Function));
          done();
        }, done.fail);
  });

  it('should not throw error if the descriptor has no values', () => {
    class Class extends BaseDisposable {}

    let descriptor = Mocks.object('descriptor');
    assert(decorator(Class.prototype, 'property', descriptor)).to.equal(descriptor);
  });

  it('should throw error if the target is not an instance of BaseDisposable', () => {
    class Class {}
    assert(() => {
      decorator(Class.prototype, 'property', {});
    }).to.throwError(/to be an instance of BaseDisposable/);
  });
});