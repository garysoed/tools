import { DisposableFunction } from '../dispose';
import { Errors } from '../error';
import { Event } from '../interfaces';
import { ElementSelectorImpl } from '../persona/element-selector';
import { Listener } from '../persona/listener';
import { ElementSelector } from '../persona/selectors';

export class EventListener implements Listener<string> {
  constructor(
      private readonly selector_: ElementSelectorImpl<any>,
      private readonly eventType_: string) { }

  start(
      root: ShadowRoot,
      handler: (event: Event<string>) => any,
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

export function eventListener(
    selector: ElementSelector<any>, eventType: string): EventListener {
  if (!(selector instanceof ElementSelectorImpl)) {
    throw Errors.assert('selector').shouldBeAnInstanceOf(ElementSelectorImpl).butWas(selector);
  }

  return new EventListener(selector, eventType);
}
