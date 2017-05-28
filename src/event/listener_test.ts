import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { BaseDisposable } from '../dispose/base-disposable';
import { ANNOTATIONS as EVENT_ANNOTATIONS } from '../event/event';
import { listener } from '../event/listener';
import { ANNOTATIONS as MONAD_ANNOTATIONS } from '../event/monad';
import { MonadUtil } from '../event/monad-util';
import { ON_ANNOTATIONS } from '../event/on';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Mocks } from '../mock/mocks';
import { TestDispose } from '../testing/test-dispose';


class TestDisposable extends BaseDisposable { }


describe('event.listener', () => {
  it('should listen to the events correctly', () => {
    const ctor = listener()(TestDisposable)!;

    const key1 = 'key1';
    const value1 = Mocks.object('value1');
    ctor.prototype[key1] = value1;

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
    const value2 = Mocks.object('value2');
    ctor.prototype[key2] = value2;

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

    const monadData = Mocks.object('monadData');
    const mockAttachedMonadAnnotations = jasmine.createSpyObj('AttachedMonadAnnotations', ['get']);
    mockAttachedMonadAnnotations.get.and.returnValue(monadData);
    const mockMonadAnnotations = jasmine.createSpyObj('MonadAnnotations', ['getAttachedValues']);
    mockMonadAnnotations.getAttachedValues.and.returnValue(mockAttachedMonadAnnotations);
    spyOn(MONAD_ANNOTATIONS, 'forCtor').and.returnValue(mockMonadAnnotations);

    const eventData = Mocks.object('eventData');
    const mockAttachedEventAnnotations = jasmine.createSpyObj('AttachedEventAnnotations', ['get']);
    mockAttachedEventAnnotations.get.and.returnValue(eventData);
    const mockEventAnnotations = jasmine.createSpyObj('EventAnnotations', ['getAttachedValues']);
    mockEventAnnotations.getAttachedValues.and.returnValue(mockAttachedEventAnnotations);
    spyOn(EVENT_ANNOTATIONS, 'forCtor').and.returnValue(mockEventAnnotations);

    spyOn(TestDisposable.prototype, 'addDisposable');

    const instance = new ctor();
    TestDispose.add(instance);

    const event = Mocks.object('event');

    assert(instance.addDisposable).to.haveBeenCalledWith(disposable11);
    assert(mockBus11.on).to.haveBeenCalledWith(
        type11,
        Matchers.any(Function),
        instance,
        useCapture11);
    mockBus11.on.calls.argsFor(0)[1](event);
    assert(MonadUtil.callFunction).to
        .haveBeenCalledWith(monadData, eventData, event, value1, instance);
    assert(mockAttachedMonadAnnotations.get).to.haveBeenCalledWith(key1);
    assert(mockAttachedEventAnnotations.get).to.haveBeenCalledWith(key1);

    assert(instance.addDisposable).to.haveBeenCalledWith(disposable12);
    assert(mockBus12.on).to.haveBeenCalledWith(
        type12,
        Matchers.any(Function),
        instance,
        useCapture12);
    mockBus12.on.calls.argsFor(0)[1](event);
    assert(MonadUtil.callFunction).to
        .haveBeenCalledWith(monadData, eventData, event, value1, instance);
    assert(mockAttachedMonadAnnotations.get).to.haveBeenCalledWith(key1);
    assert(mockAttachedEventAnnotations.get).to.haveBeenCalledWith(key1);

    assert(mockBus2.on).to.haveBeenCalledWith(
        type2,
        Matchers.any(Function),
        instance,
        useCapture2);
    mockBus2.on.calls.argsFor(0)[1](event);
    assert(MonadUtil.callFunction).to
        .haveBeenCalledWith(monadData, eventData, event, value2, instance);
    assert(mockAttachedMonadAnnotations.get).to.haveBeenCalledWith(key2);
    assert(mockAttachedEventAnnotations.get).to.haveBeenCalledWith(key2);

    assert(MONAD_ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestDisposable);
    assert(EVENT_ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestDisposable);

    assert(ON_ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestDisposable);
  });

  it('should handle the case where there are no monad annotations', () => {
    const ctor = listener()(TestDisposable)!;

    const key = 'key';
    const value = Mocks.object('value');
    ctor.prototype[key] = value;

    const disposable = Mocks.object('disposable');
    const mockBus = jasmine.createSpyObj('Bus', ['on']);
    mockBus.on.and.returnValue(disposable);
    const type = Mocks.object('type');
    const useCapture = true;

    spyOn(MonadUtil, 'callFunction');

    const attachedOnAnnotations = ImmutableMap.of([
      [
        key,
        ImmutableSet.of([{bus: mockBus, type: type, useCapture: useCapture}]),
      ],
    ]);
    const mockOnAnnotations = jasmine.createSpyObj('OnAnnotations', ['getAttachedValues']);
    mockOnAnnotations.getAttachedValues.and.returnValue(attachedOnAnnotations);
    spyOn(ON_ANNOTATIONS, 'forCtor').and.returnValue(mockOnAnnotations);

    const mockAttachedMonadAnnotations = jasmine.createSpyObj('AttachedMonadAnnotations', ['get']);
    mockAttachedMonadAnnotations.get.and.returnValue(null);
    const mockMonadAnnotations = jasmine.createSpyObj('MonadAnnotations', ['getAttachedValues']);
    mockMonadAnnotations.getAttachedValues.and.returnValue(mockAttachedMonadAnnotations);
    spyOn(MONAD_ANNOTATIONS, 'forCtor').and.returnValue(mockMonadAnnotations);

    const eventData = Mocks.object('eventData');
    const mockAttachedEventAnnotations = jasmine.createSpyObj('AttachedEventAnnotations', ['get']);
    mockAttachedEventAnnotations.get.and.returnValue(eventData);
    const mockEventAnnotations = jasmine.createSpyObj('EventAnnotations', ['getAttachedValues']);
    mockEventAnnotations.getAttachedValues.and.returnValue(mockAttachedEventAnnotations);
    spyOn(EVENT_ANNOTATIONS, 'forCtor').and.returnValue(mockEventAnnotations);

    spyOn(TestDisposable.prototype, 'addDisposable');

    const instance = new ctor();
    TestDispose.add(instance);

    const event = Mocks.object('event');

    assert(mockBus.on).to.haveBeenCalledWith(
        type,
        Matchers.any(Function),
        instance,
        useCapture);
    mockBus.on.calls.argsFor(0)[1](event);
    assert(MonadUtil.callFunction).to
        .haveBeenCalledWith(ImmutableSet.of([]), eventData, event, value, instance);
    assert(mockAttachedMonadAnnotations.get).to.haveBeenCalledWith(key);
    assert(mockAttachedEventAnnotations.get).to.haveBeenCalledWith(key);

    assert(MONAD_ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestDisposable);
    assert(EVENT_ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestDisposable);

    assert(ON_ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestDisposable);
  });

  it('should handle the case where there are no event annotations', () => {
    const ctor = listener()(TestDisposable)!;

    const key = 'key';
    const value = Mocks.object('value');
    ctor.prototype[key] = value;

    const disposable = Mocks.object('disposable');
    const mockBus = jasmine.createSpyObj('Bus', ['on']);
    mockBus.on.and.returnValue(disposable);
    const type = Mocks.object('type');
    const useCapture = true;

    spyOn(MonadUtil, 'callFunction');

    const attachedOnAnnotations = ImmutableMap.of([
      [
        key,
        ImmutableSet.of([{bus: mockBus, type: type, useCapture: useCapture}]),
      ],
    ]);
    const mockOnAnnotations = jasmine.createSpyObj('OnAnnotations', ['getAttachedValues']);
    mockOnAnnotations.getAttachedValues.and.returnValue(attachedOnAnnotations);
    spyOn(ON_ANNOTATIONS, 'forCtor').and.returnValue(mockOnAnnotations);

    const monadData = Mocks.object('monadData');
    const mockAttachedMonadAnnotations = jasmine.createSpyObj('AttachedMonadAnnotations', ['get']);
    mockAttachedMonadAnnotations.get.and.returnValue(monadData);
    const mockMonadAnnotations = jasmine.createSpyObj('MonadAnnotations', ['getAttachedValues']);
    mockMonadAnnotations.getAttachedValues.and.returnValue(mockAttachedMonadAnnotations);
    spyOn(MONAD_ANNOTATIONS, 'forCtor').and.returnValue(mockMonadAnnotations);

    const mockAttachedEventAnnotations = jasmine.createSpyObj('AttachedEventAnnotations', ['get']);
    mockAttachedEventAnnotations.get.and.returnValue(null);
    const mockEventAnnotations = jasmine.createSpyObj('EventAnnotations', ['getAttachedValues']);
    mockEventAnnotations.getAttachedValues.and.returnValue(mockAttachedEventAnnotations);
    spyOn(EVENT_ANNOTATIONS, 'forCtor').and.returnValue(mockEventAnnotations);

    spyOn(TestDisposable.prototype, 'addDisposable');

    const instance = new ctor();
    TestDispose.add(instance);

    const event = Mocks.object('event');

    assert(mockBus.on).to.haveBeenCalledWith(
        type,
        Matchers.any(Function),
        instance,
        useCapture);
    mockBus.on.calls.argsFor(0)[1](event);
    assert(MonadUtil.callFunction).to
        .haveBeenCalledWith(monadData, ImmutableSet.of([]), event, value, instance);
    assert(mockAttachedMonadAnnotations.get).to.haveBeenCalledWith(key);
    assert(mockAttachedEventAnnotations.get).to.haveBeenCalledWith(key);

    assert(MONAD_ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestDisposable);
    assert(EVENT_ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestDisposable);

    assert(ON_ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestDisposable);
  });

  it('should throw error if the object does not extend BaseDisposable', () => {
    const ctor = listener()(class {})!;

    assert(() => {
      new ctor();
    }).to.throwError(/cannot be a @listener/i);
  });
});
