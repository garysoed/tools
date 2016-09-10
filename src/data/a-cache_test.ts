import {assert, TestBase, verify, verifyNoCalls} from '../test-base';
TestBase.setup();

import Cache from './a-cache';

describe('data.@Cache', () => {
  class TestClass {
    spy_: jasmine.Spy;

    constructor(spy: jasmine.Spy) {
      this.spy_ = spy;
    }

    @Cache()
    get property(): any {
      return this.spy_();
    }

    @Cache('method')
    method(): void {
      return this.spy_();
    }
  }

  let test;
  let spy;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');
    test = new TestClass(spy);
  });

  it('should cache the getter', () => {
    let value = 'value';
    spy.and.returnValue(value);

    assert(test.property).to.equal(value);

    spy.calls.reset();
    assert(test.property).to.equal(value);
    verifyNoCalls(spy);
  });

  it('should cache the method', () => {
    let value = 'value';
    spy.and.returnValue(value);

    assert(test.method()).to.equal(value);

    spy.calls.reset();
    assert(test.method()).to.equal(value);
    verifyNoCalls(spy);
  });

  it('should throw error on non getter properties', () => {
    let descriptor = <TypedPropertyDescriptor<any>> {};
    assert(() => {
      Cache()({}, 'property', descriptor);
    }).to.throwError(/has to be a getter or a function/);
  });

  describe('clear', () => {
    it('should clear all the cache if no key is specified', () => {
      let value = 'value';
      spy.and.returnValue(value);

      assert(test.property).to.equal(value);
      assert(test.method()).to.equal(value);

      let newValue = 'newValue';
      spy.calls.reset();
      spy.and.returnValue(newValue);

      Cache.clear(test);
      assert(test.property).to.equal(newValue);
      verify(spy)();

      spy.calls.reset();
      assert(test.method()).to.equal(newValue);
      verify(spy)();
    });

    it('should clear only cache with the specified key', () => {
      let value = 'value';
      spy.and.returnValue(value);

      assert(test.property).to.equal(value);
      assert(test.method()).to.equal(value);

      let newValue = 'newValue';
      spy.calls.reset();
      spy.and.returnValue(newValue);

      Cache.clear(test, 'method');
      assert(test.property).to.equal(value);
      verifyNoCalls(spy);

      assert(test.method()).to.equal(newValue);
      verify(spy)();
    });
  });
});
