import {assert, Matchers, TestBase} from 'src/test-base';
TestBase.setup();

import {TestDispose} from 'src/testing/test-dispose';

import BaseService from './base-service';


describe('ng.BaseService', () => {
  let mockWindow;
  let service;

  beforeEach(() => {
    mockWindow = jasmine.createSpyObj('Window', ['addEventListener', 'removeEventListener']);
    service = new BaseService(mockWindow);
    TestDispose.add(service);
  });

  describe('onBeforeUnload_', () => {
    it('should dispose itself on beforeunload', () => {
      spyOn(service, 'dispose').and.callThrough();

      assert(mockWindow.addEventListener).to
          .haveBeenCalledWith('beforeunload', Matchers.any(Function), false);

      mockWindow.addEventListener.calls.argsFor(0)[1]({ type: 'beforeunload' });

      assert(service.dispose).to.haveBeenCalledWith();
    });
  });
});
