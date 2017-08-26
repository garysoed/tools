import { assert, TestBase } from '../test-base';
TestBase.setup();

import { BaseDisposable } from '../dispose';
import { asBaseDisposableCtor } from '../persona/on-dom';

describe('persona.asBaseDisposableCtor', () => {
  it(`should return the constructor`, () => {
    class TestClass extends BaseDisposable { }

    assert(asBaseDisposableCtor(TestClass.prototype)).to.equal(TestClass);
  });

  it(`should throw error if the target is not an instance of BaseDisposable`, () => {
    class TestClass { }

    assert(() => {
      asBaseDisposableCtor(TestClass.prototype);
    }).to.throwError(/not an instance of BaseDisposable/);
  });
});
