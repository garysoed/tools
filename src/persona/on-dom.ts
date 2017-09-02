import { BaseDisposable } from '../dispose';
import { eventListener } from '../persona';
import { ElementSelector } from '../persona/element-selector';
import { Persona } from '../persona/persona';

export function asBaseDisposableCtor(target: Object): typeof BaseDisposable {
  if (!(target instanceof BaseDisposable)) {
    throw new Error(`${target} is not an instance of BaseDisposable`);
  }

  return target.constructor as (typeof BaseDisposable);
}

export const onDom = {
  event(
      selector: ElementSelector<any>,
      eventType: string,
      useCapture: boolean = false): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
      Persona.defineListener(
          asBaseDisposableCtor(target),
          propertyKey,
          eventListener(selector, eventType),
          useCapture);
    };
  },
};
