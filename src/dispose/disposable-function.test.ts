import { assert, createSpy, should, Spy } from '@gs-testing';

import { DisposableFunction } from './disposable-function';
import { TestDispose } from './testing/test-dispose';


describe('dispose.DisposableFunction', () => {
  let mockFunction: Spy<unknown, []>;
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
