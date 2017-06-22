import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Fakes } from '../mock/fakes';
import { Mocks } from '../mock/mocks';
import { ATTRIBUTE_CHANGE_HANDLER, EVENT_HANDLER, Handle } from '../webc/handle';
import { Util } from '../webc/util';


describe('webc.Handler', () => {
  const SELECTOR = 'SELECTOR';
  let handler: Handle;

  beforeEach(() => {
    handler = new Handle(SELECTOR);
  });

  describe('configure', () => {
    it('should configure the handlers correctly', () => {
      const element = Mocks.object('element');
      const instance = Mocks.object('instance');
      spyOn(Handle, 'configure_').and.returnValue(new Set());

      Handle.configure(element, instance);

      assert(Handle['configure_']).to
          .haveBeenCalledWith(element, instance, ATTRIBUTE_CHANGE_HANDLER);
      assert(Handle['configure_']).to
          .haveBeenCalledWith(element, instance, EVENT_HANDLER);
    });

    it('should throw error if there are unresolved electors', () => {
      const selector = 'selector';
      const element = Mocks.object('element');
      const instance = Mocks.object('instance');
      spyOn(Handle, 'configure_').and.returnValue(new Set(selector));

      assert(() => {
        Handle.configure(element, instance);
      }).to.throwError(new RegExp(selector));
    });
  });

  describe('configure_', () => {
    it('should configure the element and handler correctly', () => {
      const parentElement = Mocks.object('parentElement');
      const instance = Mocks.object('instance');
      const mockHandle = jasmine.createSpyObj('Handle', ['configure', 'getConfigs']);

      const selector1_1 = Mocks.object('selector1_1');
      const configs1_1 = Mocks.object('configs1_1');
      configs1_1.selector = selector1_1;

      const selector1_2 = Mocks.object('selector1_2');
      const configs1_2 = Mocks.object('configs1_2');
      configs1_2.selector = selector1_2;

      const selector2_1 = Mocks.object('selector2_1');
      const configs2_1 = Mocks.object('configs2_1');
      configs2_1.selector = selector2_1;

      const selector2_2 = Mocks.object('selector2_2');
      const configs2_2 = Mocks.object('configs2_2');
      configs2_2.selector = selector2_2;

      const map = ImmutableMap.of([
        ['propertyKey1', ImmutableSet.of([configs1_1, configs1_2])],
        ['propertyKey2', ImmutableSet.of([configs2_1, configs2_2])],
      ]);
      mockHandle.getConfigs.and.returnValue(map);

      const targetEl1 = Mocks.object('targetEl1');
      const targetEl2 = Mocks.object('targetEl2');

      Fakes.build(spyOn(Util, 'resolveSelector'))
          .when(selector1_1).return(targetEl1)
          .when(selector1_2).return(targetEl1)
          .when(selector2_1).return(targetEl2)
          .when(selector2_2).return(targetEl2);

      Handle['configure_'](parentElement, instance, mockHandle);

      assert(mockHandle.configure).to
          .haveBeenCalledWith(targetEl1, instance, ImmutableSet.of([configs1_1, configs1_2]));
      assert(mockHandle.configure).to
          .haveBeenCalledWith(targetEl2, instance, ImmutableSet.of([configs2_1, configs2_2]));

      assert(Util.resolveSelector).to.haveBeenCalledWith(selector1_1, parentElement);
      assert(Util.resolveSelector).to.haveBeenCalledWith(selector1_2, parentElement);
      assert(Util.resolveSelector).to.haveBeenCalledWith(selector2_1, parentElement);
      assert(Util.resolveSelector).to.haveBeenCalledWith(selector2_2, parentElement);

      assert(mockHandle.getConfigs).to.haveBeenCalledWith(instance);
    });

    it('should return the unresolved selectors', () => {
      const parentElement = Mocks.object('parentElement');
      const instance = Mocks.object('instance');
      const mockHandle = jasmine.createSpyObj('Handle', ['configure', 'getConfigs']);

      const selector = Mocks.object('selector');
      const configs = Mocks.object('configs');
      configs.selector = selector;

      const map = ImmutableMap.of([['propertyKey', ImmutableSet.of([configs])]]);
      mockHandle.getConfigs.and.returnValue(map);

      spyOn(Util, 'resolveSelector').and.returnValue(null);

      assert(Handle['configure_'](parentElement, instance, mockHandle))
          .to.haveElements([selector]);

      assert(mockHandle.configure).toNot.haveBeenCalled();
      assert(Util.resolveSelector).to.haveBeenCalledWith(selector, parentElement);
      assert(mockHandle.getConfigs).to.haveBeenCalledWith(instance);
    });
  });
});
