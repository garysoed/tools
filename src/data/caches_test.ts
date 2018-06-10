import { TestBase } from '../test-base';
TestBase.setup();

import { assert } from 'gs-testing/export/main';
import { cache } from '../data/cache';
import { clear, clearAll } from './caches';

describe('data.Caches', () => {
  /**
   * @test
   */
  class TestClass {
    constructor(readonly spy_: jasmine.Spy) { }

    @cache()
    method(): void {
      return this.spy_();
    }
  }

  let test: TestClass;
  let spy: any;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');
    test = new TestClass(spy);
  });

  describe('clear', () => {
    it('should clear the cache', () => {
      const value = 'value';
      spy.and.returnValue(value);

      assert(test.method()).to.equal(value);

      const newValue = 'newValue';
      spy.calls.reset();
      spy.and.returnValue(newValue);

      clear(test, 'method');
      assert(spy).toNot.haveBeenCalled();
      assert(test.method()).to.equal(newValue);
      assert(spy).to.haveBeenCalledWith();
    });
  });

  describe('clearAll', () => {
    it('should clear all the cache', () => {
      const value = 'value';
      spy.and.returnValue(value);

      assert(test.method()).to.equal(value);

      const newValue = 'newValue';
      spy.calls.reset();
      spy.and.returnValue(newValue);

      clearAll(test);
      assert(spy).toNot.haveBeenCalled();
      assert(test.method()).to.equal(newValue);
      assert(spy).to.haveBeenCalledWith();
    });
  });
});
