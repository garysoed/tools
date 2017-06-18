import { BaseDisposable } from '../dispose/base-disposable';
import { MonadUtil } from '../event/monad-util';
import { ON_ANNOTATIONS } from '../event/on';
import { Event } from '../interfaces/event';
import { Reflect } from '../util/reflect';

export function listener(): ClassDecorator {
  return (target: new (...args: any[]) => {}) => {
    Reflect.addInitializer(
        target,
        (instance: any) => {
          if (!(instance instanceof BaseDisposable)) {
            throw new Error(`Object of ${target} cannot be a @listener`);
          }

          const attachedValues = ON_ANNOTATIONS.forCtor(target).getAttachedValues();
          for (const [key, values] of attachedValues) {
            for (const {busProvider, type, useCapture} of values) {
              const bus = busProvider(instance);
              instance.addDisposable(bus.on(
                  type,
                  (event: Event<any>) => {
                    MonadUtil.callFunction(event, instance, key);
                  },
                  instance,
                  useCapture));
            }
          }
        });
  };
}
