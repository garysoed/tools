import 'jasmine';

import { TestBase } from '../test-base';
TestBase.setup();

import { assert, should } from 'gs-testing/export/main';
import { Mocks } from 'gs-testing/export/mock';
import { BaseDisposable } from '../dispose/base-disposable';
import { TestDispose } from '../dispose/testing/test-dispose';
import { atomic } from './atomic';


describe('async.atomic', () => {
  let decorator: MethodDecorator;

  beforeEach(() => {
    decorator = atomic();
  });

  should('should replace the descriptor with a function that sequence the annotated function',
      async () => {
    /**
     * Test class.
     */
    class TestClass extends BaseDisposable {
      private lock_: boolean = false;

      constructor() {
        super();
      }

      @atomic()
      async method(): Promise<void> {
        expect(this.lock_).toBe(false);
        this.lock_ = true;

        return new Promise<void>(resolve => {
          window.setTimeout(() => {
            this.lock_ = false;
            resolve();
          }, 0);
        });
      }
    }

    const testClass = new TestClass();
    TestDispose.add(testClass);

    const call1Promise = testClass.method();
    const call2Promise = testClass.method();
    await call1Promise;
    await call2Promise;
  });

  should('should not throw error if the descriptor has no values', () => {
    /**
     * Test class.
     */
    class TestClass extends BaseDisposable {}

    const descriptor = Mocks.object('descriptor');
    assert(decorator(TestClass.prototype, 'property', descriptor)).to.equal(descriptor);
  });

  should('should throw error if the target is not an instance of BaseDisposable', () => {
    /**
     * Test class.
     */
    class TestClass { }
    assert(() => {
      decorator(TestClass.prototype, 'property', {});
    }).to.throwError(/should be an instance of \[BaseDisposable\]/);
  });
});
