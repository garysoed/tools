import { Annotations } from '../data/annotations';
import { BaseDisposable } from '../dispose/base-disposable';
import { ANNOTATIONS as EVENT_ANNOTATIONS } from '../event/event';
import { ANNOTATIONS as MONAD_ANNOTATIONS } from '../event/monad';
import { MonadUtil } from '../event/monad-util';
import { ON_ANNOTATIONS } from '../event/on';
import { ImmutableSet } from '../immutable/immutable-set';

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
                (event: any) => {
                  const monadData = MONAD_ANNOTATIONS.forCtor(target).getAttachedValues().get(key)
                      || ImmutableSet.of([]);
                  const eventData = EVENT_ANNOTATIONS.forCtor(target).getAttachedValues().get(key)
                      || ImmutableSet.of([]);
                  MonadUtil.callFunction(monadData, eventData, event, this[key], this);
                },
                this,
                useCapture));
          }
        }
      }
    };
  };
}
