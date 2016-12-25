import {assert, Matchers, TestBase} from '../test-base';
TestBase.setup();

import {TestDispose} from '../testing/test-dispose';

import BaseComponent from './base-component';
import FakeScope from './fake-scope';


describe('ng.BaseComponent', () => {
  let mock$scope;
  let component;

  beforeEach(() => {
    mock$scope = FakeScope.create();
    component = new BaseComponent(mock$scope);
    TestDispose.add(component);
  });

  describe('$onDestroy', () => {
    it('should dispose the controller', () => {
      let spyDispose = spyOn(component, 'dispose').and.callThrough();
      component.$onDestroy();
      assert(spyDispose).to.haveBeenCalledWith();
    });
  });

  describe('triggerDigest', () => {
    it('should trigger the digest cycle', () => {
      spyOn(mock$scope, '$apply');
      component.triggerDigest();
      assert(mock$scope.$apply).to.haveBeenCalledWith(Matchers.any(Function));
    });
  });
});
