import BaseListenable from '../event/base-listenable';

const __calls = Symbol('calls');

export default {
  getPayloads<E>(target: BaseListenable<E>, eventType: E): any[] {
    if (!target[__calls]) {
      throw Error(`Target ${target} has not been spied on`);
    }

    return target[__calls].get(eventType) || [];
  },

  spyOn<E>(target: BaseListenable<E>): any {
    if (!target[__calls]) {
      target[__calls] = new Map<E, any[]>();
    }

    return spyOn(target, 'dispatch').and.callFake((eventType: E, payload: any) => {
      if (!target[__calls].has(eventType)) {
        target[__calls].set(eventType, []);
      }

      target[__calls].get(eventType).push(payload);
    });
  },

  afterEach(): void {
    // Noop
  },

  beforeEach(): void {
    // Noop
  },
}
