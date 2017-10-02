import { BaseDisposable } from '../dispose';
import { attributeChangeListener, eventListener } from '../persona';
import { childrenListener } from '../persona/children-listener';
import { Persona } from '../persona/persona';
import { AttributeSelector, ChildrenSelector, ElementSelector } from '../persona/selectors';

export function asBaseDisposableCtor(target: Object): typeof BaseDisposable {
  if (!(target instanceof BaseDisposable)) {
    throw new Error(`${target} is not an instance of BaseDisposable`);
  }

  return target.constructor as (typeof BaseDisposable);
}

export const onDom = {
  attributeChange(selector: AttributeSelector<any>): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
      Persona.defineListener(
          asBaseDisposableCtor(target),
          propertyKey,
          attributeChangeListener(selector));
    };
  },
  children(selector: ChildrenSelector<any>): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
      Persona.defineListener(
          asBaseDisposableCtor(target),
          propertyKey,
          childrenListener(selector));
    };
  },
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
