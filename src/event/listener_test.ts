import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { BaseDisposable } from '../dispose/base-disposable';
import { listener } from '../event/listener';
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

    const disposable11 = Mocks.object('disposable11');
    const mockBus11 = jasmine.createSpyObj('Bus11', ['on']);
    mockBus11.on.and.returnValue(disposable11);
    const mockBusProvider11 = jasmine.createSpy('BusProvider11');
    mockBusProvider11.and.returnValue(mockBus11);
    const type11 = Mocks.object('type11');
    const useCapture11 = true;
    const mockHandler11 = jasmine.createSpy('Handler11');

    const disposable12 = Mocks.object('disposable12');
    const mockBus12 = jasmine.createSpyObj('Bus12', ['on']);
    mockBus12.on.and.returnValue(disposable12);
    const mockBusProvider12 = jasmine.createSpy('BusProvider12');
    mockBusProvider12.and.returnValue(mockBus12);
    const type12 = Mocks.object('type12');
    const useCapture12 = false;
    const mockHandler12 = jasmine.createSpy('Handler12');

    const disposable2 = Mocks.object('disposable2');
    const mockBus2 = jasmine.createSpyObj('Bus2', ['on']);
    mockBus2.on.and.returnValue(disposable2);
    const mockBusProvider2 = jasmine.createSpy('BusProvider2');
    mockBusProvider2.and.returnValue(mockBus2);
    const type2 = Mocks.object('type2');
    const useCapture2 = true;
    const mockHandler2 = jasmine.createSpy('Handler2');

    const attachedOnAnnotations = ImmutableMap.of([
      [
        'key1',
        ImmutableSet.of([
          {
            busProvider: mockBusProvider11,
            handler: mockHandler11,
            type: type11,
            useCapture: useCapture11,
          },
          {
            busProvider: mockBusProvider12,
            handler: mockHandler12,
            type: type12,
            useCapture: useCapture12,
          },
        ]),
      ],
      [
        'key2',
        ImmutableSet.of([{
          busProvider: mockBusProvider2,
          handler: mockHandler2,
          type: type2,
          useCapture: useCapture2,
        }]),
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
        Matchers.anyFunction(),
        instance,
        useCapture11);
    mockBus11.on.calls.argsFor(0)[1](event);
    assert(mockBusProvider11).to.haveBeenCalledWith(instance);
    assert(mockHandler11).to.haveBeenCalledWith(event, instance);

    assert(instance.addDisposable).to.haveBeenCalledWith(disposable12);
    assert(mockBus12.on).to.haveBeenCalledWith(
        type12,
        Matchers.anyFunction(),
        instance,
        useCapture12);
    mockBus12.on.calls.argsFor(0)[1](event);
    assert(mockBusProvider12).to.haveBeenCalledWith(instance);
    assert(mockHandler12).to.haveBeenCalledWith(event, instance);

    assert(mockBus2.on).to.haveBeenCalledWith(
        type2,
        Matchers.anyFunction(),
        instance,
        useCapture2);
    mockBus2.on.calls.argsFor(0)[1](event);
    assert(mockBusProvider2).to.haveBeenCalledWith(instance);
    assert(mockHandler2).to.haveBeenCalledWith(event, instance);

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
