import { assert, should } from 'gs-testing/export/main';
import { createSpy, fake, resetCalls, Spy } from 'gs-testing/export/spy';
import { cache } from '../data/cache';
import { clear, clearAll } from './caches';

describe('data.Caches', () => {
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

  let test: TestClass;
  let spy: Spy<string, []>;

  beforeEach(() => {
    spy = createSpy('spy');
    test = new TestClass(spy);
  });

  describe('clear', () => {
    should('clear the cache', () => {
      const value = 'value';
      fake(spy).always().return(value);

      assert(test.method()).to.equal(value);

      const newValue = 'newValue';
      resetCalls(spy);
      fake(spy).always().return(newValue);

      clear(test, 'method');
      assert(spy).toNot.haveBeenCalled();
      assert(test.method()).to.equal(newValue);
      assert(spy).to.haveBeenCalledWith();
    });
  });

  describe('clearAll', () => {
    should('clear all the cache', () => {
      const value = 'value';
      fake(spy).always().return(value);

      assert(test.method()).to.equal(value);

      const newValue = 'newValue';
      resetCalls(spy);
      fake(spy).always().return(newValue);

      clearAll(test);
      assert(spy).toNot.haveBeenCalled();
      assert(test.method()).to.equal(newValue);
      assert(spy).to.haveBeenCalledWith();
    });
  });
});
