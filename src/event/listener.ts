import { BaseDisposable } from '../dispose/base-disposable';
import { MonadUtil } from '../event/monad-util';
import { ON_ANNOTATIONS } from '../event/on';
import { Event } from '../interfaces/event';

export function listener(): ClassDecorator {
  return (target: new (...args: any[]) => {}) => {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
        if (!(this instanceof BaseDisposable)) {
          throw new Error(`Object of ${target} cannot be a @listener`);
        }

        const attachedValues = ON_ANNOTATIONS.forCtor(target).getAttachedValues();
        for (const [key, values] of attachedValues) {
          for (const {bus, type, useCapture} of values) {
            this.addDisposable(bus.on(
                type,
                (event: Event<any>) => {
                  MonadUtil.callFunction(event, this, key);
                },
                this,
                useCapture));
          }
        }
      }
    };
  };
}
