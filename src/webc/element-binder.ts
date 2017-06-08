import { DomBinder } from '../interfaces/dom-binder';


export class ElementBinder<T extends Element> implements DomBinder<T> {

  /**
   * @param element The element to bind to.
   */
  constructor(private readonly element_: T) { }

  /**
   * @override
   */
  delete(): void {
    throw new Error('Delete is unsupported');
  }

  /**
   * @override
   */
  get(): T {
    return this.element_;
  }

  /**
   * @override
   */
  set(value: T): void {
    throw new Error('Set is unsupported');
  }

  /**
   * Creates a new instance of the binder.
   *
   * @param element The element to bind to..
   * @return New instance of the binder.
   */
  static of<T extends Element>(element: T): ElementBinder<T> {
    return new ElementBinder<T>(element);
  }
}
// TODO: Mutable
