import TestBase from '../test-base';
TestBase.setup();

import BaseComponent from './base-component';
import FakeScope from './fake-scope';
import {TestDispose} from '../testing/test-dispose';


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
      expect(spyDispose).toHaveBeenCalledWith();
    });
  });

  describe('triggerDigest', () => {
    it('should trigger the digest cycle', () => {
      spyOn(mock$scope, '$apply');
      component.triggerDigest();
      expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
    });
  });
});
