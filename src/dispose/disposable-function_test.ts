import TestBase from '../../test-base';
TestBase.setup();

import DisposableFunction from './disposable-function';

describe('util.DisposableFunction', () => {
  let mockFunction;
  let disposableFunction;

  beforeEach(() => {
    mockFunction = jasmine.createSpy('Function');
    disposableFunction = new DisposableFunction(mockFunction);
    window['addDisposable'](disposableFunction);
  });

  describe('dispose', () => {
    it('should run the given function', () => {
      disposableFunction.dispose();
      expect(mockFunction).toHaveBeenCalledWith();
    });
  });

  describe('run', () => {
    it('should run the given function', () => {
      disposableFunction.run();
      expect(mockFunction).toHaveBeenCalledWith();
    });
  });
});
