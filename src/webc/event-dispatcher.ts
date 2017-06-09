import { DispatchFn } from '../interfaces/dispatch-fn';
import { DomBinder } from '../interfaces/dom-binder';

export class EventDispatcher implements DomBinder<DispatchFn<any>> {
  constructor (private readonly element_: Element) { }

  delete(): void {
    throw new Error('Delete is unsupported');
  }

  get(): DispatchFn<any> {
    return (name: string, payload: any = null) => {
      this.element_.dispatchEvent(new CustomEvent(name, {detail: payload}));
    };
  }

  set(value: DispatchFn<any> | null): void {
    throw new Error('Set is unsupported');
  }

  static of(element: Element): DomBinder<DispatchFn<any>> {
    return new EventDispatcher(element);
  }
}
