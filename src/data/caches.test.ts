import {Spy, assert, createSpy, fake, resetCalls, should, test} from 'gs-testing';

import {cache} from './cache';
import {clear, clearAll} from './caches';


test('data.Caches', () => {
  /**
   * @test
   */
  class TestClass {
    constructor(readonly spy_: Spy<string, []>) { }

    @cache()
    method(): string {
      return this.spy_();
    }
  }

  let testInstance: TestClass;
  let spy: Spy<string, []>;

  beforeEach(() => {
    spy = createSpy('spy');
    testInstance = new TestClass(spy);
  });

  test('clear', () => {
    should('clear the cache', () => {
      const value = 'value';
      fake(spy).always().return(value);

      assert(testInstance.method()).to.equal(value);

      const newValue = 'newValue';
      resetCalls(spy);
      fake(spy).always().return(newValue);

      clear(testInstance, 'method');
      assert(spy).toNot.haveBeenCalled();
      assert(testInstance.method()).to.equal(newValue);
      assert(spy).to.haveBeenCalledWith();
    });
  });

  test('clearAll', () => {
    should('clear all the cache', () => {
      const value = 'value';
      fake(spy).always().return(value);

      assert(testInstance.method()).to.equal(value);

      const newValue = 'newValue';
      resetCalls(spy);
      fake(spy).always().return(newValue);

      clearAll(testInstance);
      assert(spy).toNot.haveBeenCalled();
      assert(testInstance.method()).to.equal(newValue);
      assert(spy).to.haveBeenCalledWith();
    });
  });
});
