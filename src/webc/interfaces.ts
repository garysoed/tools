import { BaseDisposable } from '../dispose/base-disposable';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Parser } from '../interfaces/parser';


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
  dependencies?: ImmutableSet<gs.ICtor<any>>;

  /**
   * Tag name of the element.
   */
  tag: string;

  /**
   * Key of template to load from [Templates].
   */
  templateKey: string;
}

export interface IHandler<T> {
  /**
   * Configures the given instance to handle events from the given element.
   *
   * @param element The element that the given instance is listening to.
   * @param instance The handler for events on the given element.
   */
  configure(targetEl: Element, instance: BaseDisposable, configs: ImmutableSet<T>): void;

  /**
   * @return Configuration objects registered for the given instance.
   */
  getConfigs(instance: BaseDisposable): ImmutableMap<string | symbol, ImmutableSet<T>>;
}
