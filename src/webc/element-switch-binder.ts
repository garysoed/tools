import { ImmutableMap } from '../immutable/immutable-map';
import { DomBinder } from '../interfaces/dom-binder';

export const __enumValue: symbol = Symbol('enumValue');


/**
 * Binder to switch visibility of children of the given parent element.
 * @param <T> The enum type of the values.
 */
export class ElementSwitchBinder<T> implements DomBinder<T> {
  private currentActiveEl_: HTMLElement | null;

  constructor(
      private readonly parentEl_: Element,
      private readonly mapping_: ImmutableMap<T, string>) {
    this.currentActiveEl_ = null;
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
   * @param element The element whose enum value should be returned.
   * @return The enum value associated with the given element.
   */
  getEnumValue_(element: HTMLElement): T | null {
    const enumValue: T | null = element[__enumValue];
    if (enumValue !== undefined) {
      return enumValue;
    }

    const foundEntry = this.mapping_
        .find(([_, value]: [T, string]) => {
          return value === element.id;
        });
    const foundEnum = foundEntry ? foundEntry[0] : null;

    if (foundEnum !== null) {
      element[__enumValue] = foundEnum;
    }

    return foundEnum;
  }

  /**
   * @override
   */
  set(value: T | null): void {
    this.delete();

    if (value === null) {
      return;
    }
    const id = this.mapping_.get(value);
    if (id === undefined) {
      return;
    }

    const element = this.parentEl_.querySelector(`#${id}`);
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
   * Sets the current element to be active / inactive.
   *
   * @param element The element to set.
   * @param isActive True iff the element is active.
   */
  setActive_(element: HTMLElement, isActive: boolean): void {
    element.style.display = isActive ? '' : 'none';
  }

  /**
   * @param parentEl Parent element of the children elements.
   * @param mapping Mapping from enum value to ID of the element to associate it with.
   */
  static of<T>(parentEl: Element, mapping: Map<T, string>): ElementSwitchBinder<T> {
    return new ElementSwitchBinder(parentEl, ImmutableMap.of(mapping));
  }
}
// TODO: Mutable
