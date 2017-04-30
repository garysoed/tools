import { assert, TestBase } from '../test-base';
TestBase.setup();

import Cache from './a-cache';

describe('data.@Cache', () => {
  class TestClass {
    spy_: jasmine.Spy;

    constructor(spy: jasmine.Spy) {
      this.spy_ = spy;
    }

    @Cache()
    getProperty(): any {
      return this.spy_();
    }

    @Cache('method')
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

  it('should cache the getter', () => {
    const value = 'value';
    spy.and.returnValue(value);

    assert(test.getProperty()).to.equal(value);

    spy.calls.reset();
    assert(test.getProperty()).to.equal(value);
    assert(spy).toNot.haveBeenCalled();
  });

  it('should cache the method', () => {
    const value = 'value';
    spy.and.returnValue(value);

    assert(test.method()).to.equal(value);

    spy.calls.reset();
    assert(test.method()).to.equal(value);
    assert(spy).toNot.haveBeenCalled();
  });

  it('should throw error on non getter properties', () => {
    const descriptor = {} as TypedPropertyDescriptor<any>;
    assert(() => {
      Cache()({}, 'property', descriptor);
    }).to.throwError(/has to be a getter or a function/);
  });

  describe('clear', () => {
    it('should clear all the cache if no key is specified', () => {
      const value = 'value';
      spy.and.returnValue(value);

      assert(test.getProperty()).to.equal(value);
      assert(test.method()).to.equal(value);

      const newValue = 'newValue';
      spy.calls.reset();
      spy.and.returnValue(newValue);

      Cache.clear(test);
      assert(test.getProperty()).to.equal(newValue);
      assert(spy).to.haveBeenCalledWith();

      spy.calls.reset();
      assert(test.method()).to.equal(newValue);
      assert(spy).to.haveBeenCalledWith();
    });

    it('should clear only cache with the specified key', () => {
      const value = 'value';
      spy.and.returnValue(value);

      assert(test.getProperty()).to.equal(value);
      assert(test.method()).to.equal(value);

      const newValue = 'newValue';
      spy.calls.reset();
      spy.and.returnValue(newValue);

      Cache.clear(test, 'method');
      assert(test.getProperty()).to.equal(value);
      assert(spy).toNot.haveBeenCalled();

      assert(test.method()).to.equal(newValue);
      assert(spy).to.haveBeenCalledWith();
    });
  });
});
