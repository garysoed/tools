import { BaseDisposable } from '../dispose/base-disposable';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';

export interface Handler<T> {
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
