import { DomBinder } from './interfaces';


export class PropertyBinder<T> implements DomBinder<T> {
  private readonly element_: Element;
  private readonly propertyName_: string;

  /**
   * @param element The element to bind the property to.
   * @param propertyName The property name to bind onto.
   */
  constructor(element: Element, propertyName: string) {
    this.element_ = element;
    this.propertyName_ = propertyName;
  }

  /**
   * @override
   */
  delete(): void {
    this.element_[this.propertyName_] = undefined;
  }

  /**
   * @override
   */
  get(): T | null {
    return this.element_[this.propertyName_];
  }

  /**
   * @override
   */
  set(value: T | null): void {
    this.element_[this.propertyName_] = value;
  }

  /**
   * @param element The element to bind the property to.
   * @param propertyName The property name to bind onto.
   * @return New instance of PropertyBinder.
   */
  static of<T>(element: Element, propertyName: string): PropertyBinder<T> {
    return new PropertyBinder<T>(element, propertyName);
  }
}
