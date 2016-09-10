import {TestBase, verify} from '../test-base';
TestBase.setup();

import BaseService from './base-service';
import {TestDispose} from '../testing/test-dispose';


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

      verify(mockWindow.addEventListener)('beforeunload', jasmine.any(Function), false);

      mockWindow.addEventListener.calls.argsFor(0)[1]({ type: 'beforeunload' });

      verify(service.dispose)();
    });
  });
});
