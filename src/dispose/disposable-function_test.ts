import { TestBase } from 'gs-testing/export/main';


import { assert } from 'gs-testing/export/main';
import { DisposableFunction } from './disposable-function';
import { TestDispose } from './testing/test-dispose';


describe('dispose.DisposableFunction', () => {
  let mockFunction: any;
  let disposableFunction: DisposableFunction;

  beforeEach(() => {
    mockFunction = createSpy('Function');
    disposableFunction = new DisposableFunction(mockFunction);
    TestDispose.add(disposableFunction);
  });

  describe('dispose', () => {
    should('run the given function', () => {
      disposableFunction.dispose();
      assert(mockFunction).to.haveBeenCalledWith();
    });
  });

  describe('run', () => {
    should('run the given function', () => {
      disposableFunction.run();
      assert(mockFunction).to.haveBeenCalledWith();
    });
  });
});
