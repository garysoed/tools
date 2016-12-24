import {BaseDisposable} from 'src/dispose/base-disposable';
import {Validate} from 'src/valid/validate';

import {Sequencer} from './sequencer';

export const __SEQUENCER: symbol = Symbol('sequencer');


/**
 * Annotates a method to add it to a [Sequencer] when called.
 */
export function sequenced(): MethodDecorator {
  return function(
      target: gs.ICtor<any>,
      property: string | symbol,
      descriptor: TypedPropertyDescriptor<(...args: any[]) => any>):
      TypedPropertyDescriptor<(...args: any[]) => any> {
    Validate.any(target).to.beAnInstanceOf(BaseDisposable).assertValid();

    let originalFn = descriptor.value;
    if (originalFn !== undefined) {
      descriptor.value = function(...args: any[]): any {
        if (!this[__SEQUENCER]) {
          let sequencer = Sequencer.newInstance();
          this[__SEQUENCER] = sequencer;
          this.addDisposable(sequencer);
        }
        return this[__SEQUENCER].run(() => {
          return Promise.resolve(originalFn!.apply(this, args));
        });
      };
    }
    return descriptor;
  };
};
