import BaseListenable from '../event/base-listenable';
import TestDispose from './test-dispose';

const __calls = Symbol('calls');

export default {
  getPayloads<E>(target: BaseListenable<E>, eventType: E): any[] {
    if (!target[__calls]) {
      throw Error(`Target ${target} has not been spied on`);
    }

    return target[__calls].get(eventType) || [];
  },

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
      }));
    });
  },

  afterEach(): void {
    // Noop
  },

  beforeEach(): void {
    // Noop
  },
}
