import {IDomBinder} from './interfaces';


/**
 * Binds to an attribute in the DOM.
 */
export class AttributeBinder<T> implements IDomBinder<T> {
  private attributeName_: string;
  private element_: Element;

  /**
   * @param element The element to bind to.
   * @param attributeName Name of the attribute on the element to bind to.
   */
  constructor(element: Element, attributeName: string) {
    this.attributeName_ = attributeName;
    this.element_ = element;
  }

  /**
   * @override
   */
  delete(): void {
    let attributes = this.element_.attributes;
    if (attributes.getNamedItem(this.attributeName_) !== null) {
      attributes.removeNamedItem(this.attributeName_);
    }
  }

  /**
   * @override
   */
  get(): string | null {
    return this.element_.getAttribute(this.attributeName_);
  }

  /**
   * @override
   */
  set(value: string | null): void {
    this.element_.setAttribute(this.attributeName_, value || '');
  }

  /**
   * @param element The element to bind to.
   * @param attributeName Name of the attribute on the element to bind to.
   * @return New instance of attribute binder.
   */
  static of<T>(element: Element, attributeName: string): AttributeBinder<T> {
    return new AttributeBinder(element, attributeName);
  }
}
