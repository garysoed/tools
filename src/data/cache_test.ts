import { assert, TestBase } from '../test-base';
TestBase.setup();

import { cache } from '../data/cache';
import { Fakes } from '../mock/fakes';

describe('data.cache', () => {
  class TestClass {
    spy_: jasmine.Spy;

    constructor(spy: jasmine.Spy) {
      this.spy_ = spy;
    }

    @cache()
    add(a: any, b: any): number {
      return this.spy_(a, b);
    }

    @cache()
    getProperty(): any {
      return this.spy_();
    }

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

  it('should cache the method', () => {
    const value = 'value';
    spy.and.returnValue(value);

    assert(test.method()).to.equal(value);

    spy.calls.reset();
    assert(test.method()).to.equal(value);
    assert(spy).toNot.haveBeenCalled();
  });

  it('should cache based on the args', () => {
    Fakes.build(spy).call((a: any, b: any) => a + b);
    assert(test.add(1, 2)).to.equal(3);
    assert(test.add(1, 2)).to.equal(3);
    assert(spy).to.haveBeenCalledTimes(1);

    spy.calls.reset();
    assert(test.add(1, 3)).to.equal(4);
  });
});
