import { BaseDisposable } from '../dispose/base-disposable';
import { Parser } from '../interfaces/parser';


/**
 * Describes a binder to a dom location.
 */
export interface IDomBinder<T> {
  /**
   * Deletes the value.
   */
  delete(): void;

  /**
   * @return The value at the location.
   */
  get(): T | null;

  /**
   * Sets the value to the location.
   * @param value The value to set.
   */
  set(value: T | null): void;
}

/**
 * Configures a element.
 */
export interface IElementConfig {
  /**
   * Mapping of attribute name to attribute parser. The attribute name will be converted to
   * lower-case to be used for the attribute on the element. The element will get a getter / setter
   * which will modify the attribute value directly.
   */
  attributes?: {[name: string]: Parser<any>};

  /**
   * Element constructor of the dependencies.
   */
  dependencies?: gs.ICtor<any>[];

  /**
   * Tag name of the element.
   */
  tag: string;

  /**
   * Key of template to load from [Templates].
   */
  templateKey: string;
};

export interface IHandler<T> {
  /**
   * Configures the given instance to handle events from the given element.
   *
   * @param element The element that the given instance is listening to.
   * @param instance The handler for events on the given element.
   */
  configure(targetEl: Element, instance: BaseDisposable, configs: T[]): void;

  /**
   * @return Configuration objects registered for the given instance.
   */
  getConfigs(instance: BaseDisposable): Map<string | symbol, Set<T>>;
}
