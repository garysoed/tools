import { DispatchFn } from '../interfaces/dispatch-fn';
import { DomBinder } from '../interfaces/dom-binder';

export class EventDispatcher implements DomBinder<DispatchFn<any>> {
  constructor (private readonly element_: Element) { }

  delete(): void {
    throw new Error('Delete is unsupported');
  }

  get(): DispatchFn<any> {
    return (name: string, payload: any = null) => {
      EventDispatcher.dispatchEvent(this.element_, name, payload);
    };
  }

  set(_: DispatchFn<any> | null): void {
    throw new Error('Set is unsupported');
  }

  static dispatchEvent(element: Element, name: string, payload: any = null): void {
    element.dispatchEvent(new CustomEvent(name, {bubbles: true, detail: payload}));
  }

  static of(element: Element): DomBinder<DispatchFn<any>> {
    return new EventDispatcher(element);
  }
}
