import {assert, TestBase} from '../test-base';
TestBase.setup();

import {TestDispose} from '../testing/test-dispose';

import {DisposableFunction} from './disposable-function';


describe('dispose.DisposableFunction', () => {
  let mockFunction;
  let disposableFunction;

  beforeEach(() => {
    mockFunction = jasmine.createSpy('Function');
    disposableFunction = new DisposableFunction(mockFunction);
    TestDispose.add(disposableFunction);
  });

  describe('dispose', () => {
    it('should run the given function', () => {
      disposableFunction.dispose();
      assert(mockFunction).to.haveBeenCalledWith();
    });
  });

  describe('run', () => {
    it('should run the given function', () => {
      disposableFunction.run();
      assert(mockFunction).to.haveBeenCalledWith();
    });
  });
});
