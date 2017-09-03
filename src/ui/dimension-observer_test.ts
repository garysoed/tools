import { assert, Fakes, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { DisposableFunction } from '../dispose/disposable-function';
import { TestDispose } from '../testing/test-dispose';
import { DimensionObserver } from '../ui/dimension-observer';
import { Reflect } from '../util/reflect';

describe('ui.DimensionObserver', () => {
  let mockCallback: any;
  let observer: DimensionObserver;

  beforeEach(() => {
    mockCallback = jasmine.createSpy('Callback');
    observer = new DimensionObserver(mockCallback);
    TestDispose.add(observer);
  });

  describe('Reflect.__initialize', () => {
    it(`should initialize correctly`, () => {
      const mockDisposable = jasmine.createSpyObj('Disposable', ['dispose']);
      spyOn(observer['interval_'], 'start');
      spyOn(observer['interval_'], 'on').and.returnValue(mockDisposable);
      spyOn(observer, 'addDisposable').and.callThrough();

      observer[Reflect.__initialize]();
      assert(observer['interval_'].start).to.haveBeenCalledWith();
      assert(observer['interval_'].on).to.haveBeenCalledWith('tick', observer['onTick_'], observer);
      assert(observer.addDisposable).to.haveBeenCalledWith(mockDisposable);
    });
  });

  describe('hasChanged_', () => {
    it(`should return false if nothing has changed`, () => {
      const clientRect = {
        bottom: 1,
        height: 2,
        left: 3,
        right: 4,
        top: 5,
        width: 6,
      };
      assert(observer['hasChanged_'](clientRect, clientRect)).to.beFalse();
    });

    it(`should return true if the width has changed`, () => {
      const oldClientRect = {
        bottom: 1,
        height: 2,
        left: 3,
        right: 4,
        top: 5,
        width: 6,
      };
      const newClientRect = {
        bottom: 1,
        height: 2,
        left: 3,
        right: 4,
        top: 5,
        width: 7,
      };
      assert(observer['hasChanged_'](oldClientRect, newClientRect)).to.beTrue();
    });

    it(`should return true if the top has changed`, () => {
      const oldClientRect = {
        bottom: 1,
        height: 2,
        left: 3,
        right: 4,
        top: 5,
        width: 6,
      };
      const newClientRect = {
        bottom: 1,
        height: 2,
        left: 3,
        right: 4,
        top: 7,
        width: 6,
      };
      assert(observer['hasChanged_'](oldClientRect, newClientRect)).to.beTrue();
    });

    it(`should return true if the right has changed`, () => {
      const oldClientRect = {
        bottom: 1,
        height: 2,
        left: 3,
        right: 4,
        top: 5,
        width: 6,
      };
      const newClientRect = {
        bottom: 1,
        height: 2,
        left: 3,
        right: 7,
        top: 5,
        width: 6,
      };
      assert(observer['hasChanged_'](oldClientRect, newClientRect)).to.beTrue();
    });

    it(`should return true if the left has changed`, () => {
      const oldClientRect = {
        bottom: 1,
        height: 2,
        left: 3,
        right: 4,
        top: 5,
        width: 6,
      };
      const newClientRect = {
        bottom: 1,
        height: 2,
        left: 7,
        right: 4,
        top: 5,
        width: 6,
      };
      assert(observer['hasChanged_'](oldClientRect, newClientRect)).to.beTrue();
    });

    it(`should return true if the height has changed`, () => {
      const oldClientRect = {
        bottom: 1,
        height: 2,
        left: 3,
        right: 4,
        top: 5,
        width: 6,
      };
      const newClientRect = {
        bottom: 1,
        height: 7,
        left: 3,
        right: 4,
        top: 5,
        width: 6,
      };
      assert(observer['hasChanged_'](oldClientRect, newClientRect)).to.beTrue();
    });

    it(`should return true if the bottom has changed`, () => {
      const oldClientRect = {
        bottom: 1,
        height: 2,
        left: 3,
        right: 4,
        top: 5,
        width: 6,
      };
      const newClientRect = {
        bottom: 7,
        height: 2,
        left: 3,
        right: 4,
        top: 5,
        width: 6,
      };
      assert(observer['hasChanged_'](oldClientRect, newClientRect)).to.beTrue();
    });

    it(`should return true if the old rect is null`, () => {
      const clientRect = {
        bottom: 1,
        height: 2,
        left: 3,
        right: 4,
        top: 5,
        width: 6,
      };
      assert(observer['hasChanged_'](null, clientRect)).to.beTrue();
    });
  });

  describe('observe', () => {
    it(`should observe correctly and return the correct unregister function`, () => {
      const element = Mocks.object('element');
      const unregisterFn = Mocks.object('unregisterFn');
      const disposableOfSpy = spyOn(DisposableFunction, 'of').and.returnValue(unregisterFn);

      assert(observer.observe(element)).to.equal(unregisterFn);
      assert(observer['observedElements_']).to
          .haveEntries([[element, {boundingRect: null, unregisterFn}]]);
      assert(DisposableFunction.of).to.haveBeenCalledWith(Matchers.anyFunction());
      disposableOfSpy.calls.argsFor(0)[0]();
      assert(observer['observedElements_']).to.haveEntries([]);
    });

    it(`should return the existing unregister function if exist`, () => {
      const element = Mocks.object('element');
      const unregisterFn = Mocks.object('unregisterFn');
      observer['observedElements_'].set(element, {boundingRect: null, unregisterFn});
      spyOn(DisposableFunction, 'of');

      assert(observer.observe(element)).to.equal(unregisterFn);
      assert(DisposableFunction.of).toNot.haveBeenCalled();
    });
  });

  describe('onTick_', () => {
    it(`should check all observed elements and call the callbacks on the changed ones`, () => {
      const rect1 = Mocks.object('rect1');
      const oldRect1 = Mocks.object('oldRect1');
      const mockElement1 = jasmine.createSpyObj('Element1', ['getBoundingClientRect']);
      mockElement1.getBoundingClientRect.and.returnValue(rect1);

      const rect2 = Mocks.object('rect2');
      const oldRect2 = Mocks.object('oldRect2');
      const mockElement2 = jasmine.createSpyObj('Element2', ['getBoundingClientRect']);
      mockElement2.getBoundingClientRect.and.returnValue(rect2);

      const unregisterFn = Mocks.object('unregisterFn');
      observer['observedElements_'].set(mockElement1, {boundingRect: oldRect1, unregisterFn});
      observer['observedElements_'].set(mockElement2, {boundingRect: oldRect2, unregisterFn});

      Fakes.build(spyOn(observer, 'hasChanged_'))
          .when(oldRect1, rect1).return(true)
          .when(oldRect2, rect2).return(false);

      observer['onTick_']();
      assert(observer['observedElements_']).to.haveEntries([
        [mockElement1, Matchers.objectContaining({boundingRect: rect1})],
        [mockElement2, Matchers.objectContaining({boundingRect: oldRect2})],
      ]);
      assert(mockCallback).to.haveBeenCalledWith(rect1);
      assert(mockCallback).toNot.haveBeenCalledWith(rect2);
      assert(observer['hasChanged_']).to.haveBeenCalledWith(oldRect1, rect1);
      assert(observer['hasChanged_']).to.haveBeenCalledWith(oldRect2, rect2);
    });
  });
});
