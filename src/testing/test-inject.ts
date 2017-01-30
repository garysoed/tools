import {Injector} from '../inject/injector';


const BOUND_VALUES_: Map<string | symbol, any> = new Map();

/**
 * Test setup object for testing any code using code from the `dispose` directory.
 *
 * This checks that all [[BaseDisposable]] objects are disposed at the end of the test. Objects that
 * need to be disposed manually (because they should be disposed through some flow not covered by
 * the test) can be disposed by using the [[add]] method.
 */
export const TestInject = {

  /**
   * Gets the value bound for the given key.
   *
   * @param bindKey The binding key.
   * @return The value bound to the given key.
   */
  getBoundValue(bindKey: string | symbol): any {
    return BOUND_VALUES_.get(bindKey);
  },

  /**
   * Runs the code in jasmine's `afterEach` logic.
   */
  afterEach(): void { },

  /**
   * Runs the code in jasmine's `beforeEach` logic.
   */
  beforeEach(): void {
    BOUND_VALUES_.clear();
    spyOn(Injector, 'bind').and.callFake((ctor: gs.ICtor<any>, bindKey: string | symbol) => {
      BOUND_VALUES_.set(bindKey, ctor);
    });
    spyOn(Injector, 'bindProvider').and
        .callFake((provider: (injector: Injector) => any, bindKey: string | symbol) => {
          BOUND_VALUES_.set(bindKey, provider);
        });
  },

  init(): void { },
};

