import {assert, createSpy, fake, should, test} from 'gs-testing';

import {cached} from './cached';

test('@tools/src/data/cached', () => {
  class TestClass {
    constructor(private readonly provider: () => number) {}

    @cached()
    get value(): number {
      return this.provider();
    }
    @cached()
    get value2(): number {
      return this.provider() + 1;
    }
  }

  should('only call the getter once', () => {
    const spy = createSpy<number, []>('provider');
    const value = 1234;
    fake(spy).always().return(value);
    const test = new TestClass(spy);

    assert(test.value).to.equal(value);
    // Second call should return the same value.
    assert(test.value).to.equal(value);

    assert(spy).toNot.haveBeenCalled(2);
  });

  should('work on classes with 2 getters', () => {
    const spy = createSpy<number, []>('provider');
    const value = 1;
    fake(spy).always().return(value);
    const test = new TestClass(spy);

    assert(test.value).to.equal(value);
    assert(test.value2).to.equal(2);
  });
});
