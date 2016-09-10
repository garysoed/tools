import {TestBase, verify} from '../test-base';
TestBase.setup();

import {DisposableFunction} from './disposable-function';
import {TestDispose} from '../testing/test-dispose';


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
      verify(mockFunction)();
    });
  });

  describe('run', () => {
    it('should run the given function', () => {
      disposableFunction.run();
      verify(mockFunction)();
    });
  });
});
