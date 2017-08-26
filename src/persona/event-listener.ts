import { DisposableFunction } from '../dispose';
import { Event } from '../interfaces';
import { ElementSelector, ElementSelectorImpl } from '../persona/element-selector';
import { Listener } from '../persona/listener';

export class EventListener<E extends keyof HTMLElementEventMap> implements Listener<E> {
  constructor(
      private readonly selector_: ElementSelectorImpl<any>,
      private readonly eventType_: E) { }

  start(
      root: ShadowRoot,
      handler: (event: Event<E>) => any,
      useCapture: boolean): DisposableFunction {
    const element = this.selector_.getValue(root);
    element.addEventListener(this.eventType_, handler, useCapture);
    return DisposableFunction.of(() => {
      element.removeEventListener(this.eventType_, handler, useCapture);
    });
  }
}

export function eventListener<E extends keyof HTMLElementEventMap>(
    selector: ElementSelector<any>, eventType: E): EventListener<E> {
  if (!(selector instanceof ElementSelectorImpl)) {
    throw new Error(`${selector} is a stub. Did you run resolveSelectors?`);
  }

  return new EventListener<E>(selector, eventType);
}
