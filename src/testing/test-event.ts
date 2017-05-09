import { BaseListenable } from '../event/base-listenable';

import { TestDispose } from './test-dispose';

/**
 * @hidden
 */
const __calls = Symbol('calls');


/**
 * @deprecated Use spyOn dispatchEvent.
 */
export const TestEvent = {
  /**
   * @deprecated Use spyOn dispatchEvent.
   */
  getPayloads<E>(target: BaseListenable<E>, eventType: E): any[] {
    if (!target[__calls]) {
      throw Error(`Target ${target} has not been spied on`);
    }

    return target[__calls].get(eventType) || [];
  },

  /**
   * @deprecated Use spyOn dispatchEvent.
   */
  spyOn<E>(target: BaseListenable<E>, eventTypes: E[]): any {
    if (!target[__calls]) {
      target[__calls] = new Map<E, any[]>();
    }

    eventTypes.forEach((eventType: E) => {
      TestDispose.add(target.on(eventType, (payload: any) => {
        if (!target[__calls].has(eventType)) {
          target[__calls].set(eventType, []);
        }

        target[__calls].get(eventType).push(payload);
      }, this));
    });
  },

  /**
   * Runs the code in jasmine's `afterEach` logic.
   */
  afterEach(): void {
    // Noop
  },

  /**
   * Runs the code in jasmine's `beforeEach` logic.
   */
  beforeEach(): void {
    // Noop
  },

  init(): void { },
};
// TODO: Mutable
