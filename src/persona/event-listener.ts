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
      context: any,
      useCapture: boolean): DisposableFunction {
    const element = this.selector_.getValue(root);
    const boundHandler = handler.bind(context);
    element.addEventListener(this.eventType_, boundHandler, useCapture);
    return DisposableFunction.of(() => {
      element.removeEventListener(this.eventType_, boundHandler, useCapture);
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
