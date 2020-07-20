import { assert, createSpy, fake, resetCalls, should, Spy, test } from 'gs-testing';

import { cache } from '../data/cache';


test('data.cache', init => {
  /**
   * @test
   */
  class TestClass {
    constructor(
        readonly spyAdd: Spy<number, [number, number]>,
        readonly spyGetProperty: Spy<number, []>,
        readonly spyGetter: Spy<number, []>,
    ) { }

    @cache()
    add(a: number, b: number): number {
      return this.spyAdd(a, b);
    }

    @cache()
    getProperty(): number {
      return this.spyGetProperty();
    }

    @cache()
    get getter(): number {
      return this.spyGetter();
    }
  }

  const _ = init(() => {
    const spyAdd = createSpy<number, [number, number]>('spyAdd');
    const spyGetProperty = createSpy<number, []>('spyGetProperty');
    const spyGetter = createSpy<number, []>('spyGetter');
    const test = new TestClass(spyAdd, spyGetProperty, spyGetter);
    return {test, spyAdd, spyGetProperty, spyGetter};
  });

  should('cache the method', () => {
    const value = 123;
    fake(_.spyGetProperty).always().return(value);

    assert(_.test.getProperty()).to.equal(value);

    resetCalls(_.spyGetProperty);
    assert(_.test.getProperty()).to.equal(value);
    assert(_.spyGetProperty).toNot.haveBeenCalled();
  });

  should(`cache the getter`, () => {
    const value = 123;
    fake(_.spyGetter).always().return(value);

    assert(_.test.getter).to.equal(value);

    resetCalls(_.spyGetter);
    assert(_.test.getter).to.equal(value);
    assert(_.spyGetter).toNot.haveBeenCalled();
  });

  should('cache based on the args', () => {
    fake(_.spyAdd).always().call((a, b) => a + b);
    assert(_.test.add(1, 2)).to.equal(3);
    assert(_.test.add(1, 2)).to.equal(3);
    assert(_.spyAdd).to.haveBeenCalled(1);

    resetCalls(_.spyAdd);
    assert(_.test.add(1, 3)).to.equal(4);
  });
});
