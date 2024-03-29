import {
  Spy,
  assert,
  createSpy,
  fake,
  resetCalls,
  should,
  test,
  setup,
} from 'gs-testing';

import {cache} from '../data/cache';

test('data.cache', () => {
  /**
   * @test
   */
  class TestClass {
    constructor(
      readonly spyGetProperty: Spy<number, []>,
      readonly spyGetter: Spy<number, []>,
    ) {}

    @cache()
    get getter(): number {
      return this.spyGetter();
    }
  }

  const _ = setup(() => {
    const spyGetProperty = createSpy<number, []>('spyGetProperty');
    const spyGetter = createSpy<number, []>('spyGetter');
    const test = new TestClass(spyGetProperty, spyGetter);
    return {test, spyGetProperty, spyGetter};
  });

  should('cache the getter', () => {
    const value = 123;
    fake(_.spyGetter).always().return(value);

    assert(_.test.getter).to.equal(value);

    resetCalls(_.spyGetter);
    assert(_.test.getter).to.equal(value);
    assert(_.spyGetter).toNot.haveBeenCalled();
  });
});
