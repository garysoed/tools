import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { BaseDisposable } from '../dispose/base-disposable';
import { Mocks } from '../mock/mocks';

import { __SEQUENCER, atomic } from './atomic';
import { Sequencer } from './sequencer';


describe('async.atomic', () => {
  let decorator: MethodDecorator;

  beforeEach(() => {
    decorator = atomic();
  });

  it('should replace the descriptor with a function that sequence the annotated function',
      async () => {
    class Class extends BaseDisposable {}

    const mockFunction = jasmine.createSpy('Function');

    const property = 'property';
    const descriptor = Mocks.object('descriptor');
    descriptor.value = mockFunction;

    const mockSequencer = jasmine.createSpyObj('Sequencer', ['dispose', 'run']);
    mockSequencer.run.and.returnValue(Promise.resolve());
    spyOn(Sequencer, 'newInstance').and.returnValue(mockSequencer);

    const newDescriptor = decorator(Class.prototype, property, descriptor);
    assert(newDescriptor).to.equal(descriptor);

    const mockInstance = jasmine.createSpyObj('Instance', ['addDisposable']);
    await descriptor.value.call(mockInstance, 1, 2);

    assert(mockSequencer.run).to.haveBeenCalledWith(Matchers.anyFunction());
    mockSequencer.run.calls.argsFor(0)[0]();

    assert(mockFunction).to.haveBeenCalledWith(1, 2);
  });

  it('should reuse existing sequencer', async () => {
    class Class extends BaseDisposable {}

    const descriptor = Mocks.object('descriptor');
    descriptor.value = () => {};

    const mockSequencer = jasmine.createSpyObj('Sequencer', ['run']);
    mockSequencer.run.and.returnValue(Promise.resolve());

    const instance = Mocks.object('instance');
    instance[__SEQUENCER] = mockSequencer;
    const decoratedFunction = decorator(Class.prototype, 'property', descriptor)!.value as Function;
    await decoratedFunction.call(instance, 1, 2);
    assert(mockSequencer.run).to.haveBeenCalledWith(Matchers.anyFunction());
  });

  it('should not throw error if the descriptor has no values', () => {
    class Class extends BaseDisposable {}

    const descriptor = Mocks.object('descriptor');
    assert(decorator(Class.prototype, 'property', descriptor)).to.equal(descriptor);
  });

  it('should throw error if the target is not an instance of BaseDisposable', () => {
    class Class {}
    assert(() => {
      decorator(Class.prototype, 'property', {});
    }).to.throwError(/should be an instance of \[BaseDisposable\]/);
  });
});
