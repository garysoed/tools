import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { BaseDisposable } from '../dispose/base-disposable';
import { listener } from '../event/listener';
import { MonadUtil } from '../event/monad-util';
import { ON_ANNOTATIONS } from '../event/on';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Mocks } from '../mock/mocks';
import { TestDispose } from '../testing/test-dispose';
import { Reflect } from '../util/reflect';


class TestDisposable extends BaseDisposable { }


describe('event.listener', () => {
  it('should listen to the events correctly', () => {
    listener()(TestDisposable);

    const key1 = 'key1';

    const disposable11 = Mocks.object('disposable11');
    const mockBus11 = jasmine.createSpyObj('Bus11', ['on']);
    mockBus11.on.and.returnValue(disposable11);
    const type11 = Mocks.object('type11');
    const useCapture11 = true;

    const disposable12 = Mocks.object('disposable12');
    const mockBus12 = jasmine.createSpyObj('Bus12', ['on']);
    mockBus12.on.and.returnValue(disposable12);
    const type12 = Mocks.object('type12');
    const useCapture12 = false;

    const key2 = 'key2';

    const disposable2 = Mocks.object('disposable2');
    const mockBus2 = jasmine.createSpyObj('Bus2', ['on']);
    mockBus2.on.and.returnValue(disposable2);
    const type2 = Mocks.object('type2');
    const useCapture2 = true;

    spyOn(MonadUtil, 'callFunction');

    const attachedOnAnnotations = ImmutableMap.of([
      [
        key1,
        ImmutableSet.of([
          {bus: mockBus11, type: type11, useCapture: useCapture11},
          {bus: mockBus12, type: type12, useCapture: useCapture12},
        ]),
      ],
      [
        key2,
        ImmutableSet.of([{bus: mockBus2, type: type2, useCapture: useCapture2}]),
      ],
    ]);
    const mockOnAnnotations = jasmine.createSpyObj('OnAnnotations', ['getAttachedValues']);
    mockOnAnnotations.getAttachedValues.and.returnValue(attachedOnAnnotations);
    spyOn(ON_ANNOTATIONS, 'forCtor').and.returnValue(mockOnAnnotations);

    spyOn(TestDisposable.prototype, 'addDisposable');

    const instance = Reflect.construct(TestDisposable, []);
    TestDispose.add(instance);

    const event = Mocks.object('event');

    assert(instance.addDisposable).to.haveBeenCalledWith(disposable11);
    assert(mockBus11.on).to.haveBeenCalledWith(
        type11,
        Matchers.any(Function),
        instance,
        useCapture11);
    mockBus11.on.calls.argsFor(0)[1](event);
    assert(MonadUtil.callFunction).to.haveBeenCalledWith(event, instance, key1);

    assert(instance.addDisposable).to.haveBeenCalledWith(disposable12);
    assert(mockBus12.on).to.haveBeenCalledWith(
        type12,
        Matchers.any(Function),
        instance,
        useCapture12);
    mockBus12.on.calls.argsFor(0)[1](event);
    assert(MonadUtil.callFunction).to.haveBeenCalledWith(event, instance, key1);

    assert(mockBus2.on).to.haveBeenCalledWith(
        type2,
        Matchers.any(Function),
        instance,
        useCapture2);
    mockBus2.on.calls.argsFor(0)[1](event);
    assert(MonadUtil.callFunction).to.haveBeenCalledWith(event, instance, key2);

    assert(ON_ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestDisposable);
  });

  it('should throw error if the object does not extend BaseDisposable', () => {
    @listener()
    class NonDisposableClass { }
    assert(() => {
      Reflect.construct(NonDisposableClass, []);
    }).to.throwError(/cannot be a @listener/i);
  });
});
