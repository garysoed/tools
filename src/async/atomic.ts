import { BaseDisposable } from '../dispose/base-disposable';

import { Sequencer } from './sequencer';

export const __SEQUENCER: symbol = Symbol('sequencer');


/**
 * Annotates a method to indicate that only one instance of the method can be ran at a time.
 */
export function atomic(): MethodDecorator {
  return function(
      target: Object,
      _: string | symbol,
      descriptor: TypedPropertyDescriptor<any>):
      TypedPropertyDescriptor<any> {
    if (!(target instanceof BaseDisposable)) {
      throw new Error(`${target} should be an instance of BaseDisposable`);
    }

    const originalFn = descriptor.value;
    if (originalFn !== undefined) {
      descriptor.value = function(this: any, ...args: any[]): any {
        if (!this[__SEQUENCER]) {
          const sequencer = Sequencer.newInstance();
          this[__SEQUENCER] = sequencer;
          (this as BaseDisposable).addDisposable(sequencer);
        }
        return this[__SEQUENCER].run(() => {
          return Promise.resolve(originalFn!.apply(this, args));
        });
      };
    }
    return descriptor;
  };
}
