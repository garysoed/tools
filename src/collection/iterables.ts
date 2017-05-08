import { BaseFluent } from '../collection/base-fluent';
import { IFluentIterable } from '../collection/interfaces';
import { MappedIterable } from '../collection/mapped-iterable';
import { ImmutableList } from '../immutable/immutable-list';
import { Iterables as ImmutableIterables } from '../immutable/iterables';


/**
 * Chainable object to manipulate an iterable.
 *
 * Iterables are collections with possibly infinite elements.
 *
 * @param <T> The type of element in the iterable.
 */
export class FluentIterable<T>
    extends BaseFluent<Iterable<T>>
    implements IFluentIterable<T> {

  /**
   * @param data The underlying iterable object to modify.
   */
  constructor(data: Iterable<T>) {
    super(data);
  }

  addAll(other: Iterable<T>): FluentIterable<T> {
    const list = ImmutableList
        .of(ImmutableIterables.unsafeToArray(this.getData()))
        .addAll(ImmutableList.of(ImmutableIterables.unsafeToArray(other)));
    return Iterables.of<T>(list);
  }

  addAllArray(array: T[]): FluentIterable<T> {
    return this.addAll(array);
  }

  asIterable(): Iterable<T> {
    return this.getData();
  }

  asIterator(): Iterator<T> {
    return this.getData()[Symbol.iterator]();
  }

  filter(fn: (value: T) => boolean): IFluentIterable<T> {
    const list = ImmutableList
        .of(ImmutableIterables.unsafeToArray(this.getData()))
        .filterItem(fn);
    return Iterables.of<T>(list);
  }

  iterate(fn: (value: T, breakFn: () => void) => void): FluentIterable<T> {
    const iterator = this.getData()[Symbol.iterator]();
    let shouldBreak = false;
    for (let entry = iterator.next(); !entry.done && !shouldBreak; entry = iterator.next()) {
      fn(entry.value, () => {
        shouldBreak = true;
      });
    }
    return this;
  }

  map<T2>(fn: (value: T) => T2): IFluentIterable<T2> {
    return Iterables.of(MappedIterable.newInstance<T, T2>(this.getData(), fn));
  }
}

/**
 * Collection of methods to help manipulate iterables.
 *
 * The general flow is to input an iterable, do a bunch of transformations, and output the
 * transformed iterable at the end. Note that the input iterable should never be used again. This
 * class does not make any guarantee that it will / will not modify the input iterable.
 *
 * Example:
 *
 * ```typescript
 * Iterables
 *     .of(['a', 'b', 'c'])
 *     .forOf((value: string, breakFn: () => void) => {
 *       console.log(value);
 *     });
 * ```
 *
 * Note that every element in the iterable must be of the same type.
 */
export class Iterables {
  /**
   * Starts by using an iterable.
   *
   * @param <T> Type of the iterable element.
   * @param data The iterable object to start with.
   * @return Iterable wrapper object to do operations on.
   */
  static of<T>(data: Iterable<T>): FluentIterable<T> {
    return new FluentIterable<T>(data);
  }
}
