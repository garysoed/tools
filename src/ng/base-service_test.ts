import TestBase from '../test-base';
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

      expect(mockWindow.addEventListener)
          .toHaveBeenCalledWith('beforeunload', jasmine.any(Function));

      mockWindow.addEventListener.calls.argsFor(0)[1]({ type: 'beforeunload' });

      expect(service.dispose).toHaveBeenCalledWith();
    });
  });
});
