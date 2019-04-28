import { assert, should } from '@gs-testing';
import { createSpy, fake, resetCalls, Spy } from '@gs-testing';
import { cache } from '../data/cache';

describe('data.cache', () => {
  /**
   * @test
   */
  class TestClass {
    constructor(
        readonly spyAdd_: Spy<number, [number, number]>,
        readonly spyGetProperty_: Spy<number, []>,
    ) { }

    @cache()
    add(a: number, b: number): number {
      return this.spyAdd_(a, b);
    }

    @cache()
    getProperty(): number {
      return this.spyGetProperty_();
    }
  }

  let test: TestClass;
  let spyAdd: Spy<number, [number, number]>;
  let spyGetProperty: Spy<number, []>;

  beforeEach(() => {
    spyAdd = createSpy('spyAdd');
    spyGetProperty = createSpy('spyGetProperty');
    test = new TestClass(spyAdd, spyGetProperty);
  });

  should('cache the method', () => {
    const value = 123;
    fake(spyGetProperty).always().return(value);

    assert(test.getProperty()).to.equal(value);

    resetCalls(spyGetProperty);
    assert(test.getProperty()).to.equal(value);
    assert(spyGetProperty).toNot.haveBeenCalled();
  });

  should('cache based on the args', () => {
    fake(spyAdd).always().call((a, b) => a + b);
    assert(test.add(1, 2)).to.equal(3);
    assert(test.add(1, 2)).to.equal(3);
    assert(spyAdd).to.haveBeenCalled(1);

    resetCalls(spyAdd);
    assert(test.add(1, 3)).to.equal(4);
  });
});
