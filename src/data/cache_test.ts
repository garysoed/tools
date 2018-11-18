import { TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { assert } from 'gs-testing/export/main';
import { Fakes } from 'gs-testing/export/mock';
import { cache } from '../data/cache';

describe('data.cache', () => {
  /**
   * @test
   */
  class TestClass {
    constructor(readonly spy_: jasmine.Spy) { }

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
  let spy: jasmine.Spy;

  beforeEach(() => {
    spy = createSpy('spy');
    test = new TestClass(spy);
  });

  should('cache the method', () => {
    const value = 'value';
    spy.and.returnValue(value);

    assert(test.method()).to.equal(value);

    spy.calls.reset();
    assert(test.method()).to.equal(value);
    assert(spy).toNot.haveBeenCalled();
  });

  should('cache based on the args', () => {
    Fakes.build(spy).call((a: number, b: number) => a + b);
    assert(test.add(1, 2)).to.equal(3);
    assert(test.add(1, 2)).to.equal(3);
    assert(spy).to.haveBeenCalledTimes(1);

    spy.calls.reset();
    assert(test.add(1, 3)).to.equal(4);
  });
});
