import { Maps } from '../collection/maps';

import { IDomBinder } from './interfaces';

export const __enumValue: symbol = Symbol('enumValue');


/**
 * Binder to swiitch visibility of children of the given parent element.
 * @param <T> The enum type of the values.
 */
export class ElementSwitchBinder<T> implements IDomBinder<T> {
  private readonly mapping_: Map<T, string>;
  private readonly parentEl_: Element;

  private currentActiveEl_: HTMLElement | null;

  constructor(parentEl: Element, mapping: Map<T, string>) {
    this.currentActiveEl_ = null;
    this.mapping_ = mapping;
    this.parentEl_ = parentEl;
  }

  /**
   * @param element The element whose enum value should be returned.
   * @return The enum value associated with the given element.
   */
  private getEnumValue_(element: HTMLElement): T | null {
    let enumValue: T | null = element[__enumValue];
    if (enumValue === undefined) {
      enumValue = Maps
          .of(this.mapping_)
          .findKey((id: string) => {
            return id === element.id;
          });

      if (enumValue !== null) {
        element[__enumValue] = enumValue;
      }
    }

    return enumValue;
  }

  /**
   * Sets the current element to be active / inactive.
   *
   * @param element The element to set.
   * @param isActive True iff the element is active.
   */
  private setActive_(element: HTMLElement, isActive: boolean): void {
    element.style.display = isActive ? '' : 'none';
  }

  /**
   * @override
   */
  delete(): void {
    if (this.currentActiveEl_ !== null) {
      this.setActive_(this.currentActiveEl_, false);
    }
  }

  /**
   * @override
   */
  get(): T | null {
    if (this.currentActiveEl_ === null) {
      return null;
    }
    return this.getEnumValue_(this.currentActiveEl_);
  }

  /**
   * @override
   */
  set(value: T | null): void {
    this.delete();

    if (value === null) {
      return;
    }
    let id = this.mapping_.get(value);
    if (id === undefined) {
      return;
    }

    let element = this.parentEl_.querySelector(`#${id}`);
    if (element === null) {
      return;
    }

    if (!(element instanceof HTMLElement)) {
      return;
    }

    element[__enumValue] = value;
    this.setActive_(element, true);
  }

  /**
   * @param parentEl Parent element of the children elements.
   * @param mapping Mapping from enum value to ID of the element to associate it with.
   */
  static of<T>(parentEl: Element, mapping: Map<T, string>): ElementSwitchBinder<T> {
    return new ElementSwitchBinder(parentEl, mapping);
  }
}
