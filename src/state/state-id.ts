import { Type } from 'gs-types';

const __unused = Symbol('unused');

/**
 * ID of the state.
 *
 * @typeParams T - Type of the object associated with the ID.
 * @thHidden
 */
export interface StateId<T> {
  /**
   * String value of the ID.
   */
  readonly id: string;

  /**
   * @internal
   */
  readonly [__unused]: Type<T>;
}

/**
 * Creates a {@link StateId} with the given inner value.
 *
 * @typeParams T - Type of object associated with the ID.
 * @param innerValue - Inner value of the ID.
 * @returns StateId with the given inner value.
 * @thHidden
 */
export function createId<T>(innerValue: string): StateId<T> {
  return {id: innerValue, [__unused]: {} as any};
}
