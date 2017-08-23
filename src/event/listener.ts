import { BaseDisposable } from '../dispose/base-disposable';
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
          for (const [, values] of attachedValues) {
            for (const {busProvider, handler, type, useCapture} of values) {
              const bus = busProvider(instance);
              instance.addDisposable(bus.on(
                  type,
                  (event: Event<any>) => {
                    handler(event, instance);
                  },
                  instance,
                  useCapture));
            }
          }
        });
  };
}
