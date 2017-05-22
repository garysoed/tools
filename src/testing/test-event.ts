import { BaseListenable } from '../event/base-listenable';

import { TestDispose } from '../testing/test-dispose';
import { deprecated } from '../typescript/deprecated';
import { Log } from '../util/log';

/**
 * @hidden
 */
const __calls = Symbol('calls');

const LOGGER = Log.of('testing.TestEvent');


export class TestEvent {
  @deprecated(LOGGER, `Use 'spyOn dispatchEvent'`)
  static getPayloads<E>(target: BaseListenable<E>, eventType: E): any[] {
    if (!target[__calls]) {
      throw Error(`Target ${target} has not been spied on`);
    }

    return target[__calls].get(eventType) || [];
  }

  @deprecated(LOGGER, `Use 'spyOn dispatchEvent'`)
  static spyOn<E>(target: BaseListenable<E>, eventTypes: E[]): any {
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
  }

  /**
   * Runs the code in jasmine's `afterEach` logic.
   */
  static afterEach(): void {
    // Noop
  }

  /**
   * Runs the code in jasmine's `beforeEach` logic.
   */
  static beforeEach(): void {
    // Noop
  }

  static init(): void { }
}
// TODO: Mutable
