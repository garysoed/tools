import { assert, TestBase } from '../test-base';
TestBase.setup();

import { cache } from '../data/cache';
import { Caches } from '../data/caches';

describe('data.Caches', () => {
  class TestClass {
    spy_: jasmine.Spy;

    constructor(spy: jasmine.Spy) {
      this.spy_ = spy;
    }

    @cache()
    method(): void {
      return this.spy_();
    }
  }

  let test: TestClass;
  let spy;

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

      Caches.clear(test, 'method');
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

      Caches.clearAll(test);
      assert(spy).toNot.haveBeenCalled();
      assert(test.method()).to.equal(newValue);
      assert(spy).to.haveBeenCalledWith();
    });
  });
});
