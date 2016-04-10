/// @doc

/**
 * Utility to do various dynamic time type checks.
 *
 * In addition to supporting dynamic type checks, this uses Typescript's type guards to cast the
 * values. For example:
 *
 * ```typescript
 * if (Checks.isArrayOf<string>(input, String)) {
 *   // It's safe to treat input as string[] in this block.
 * }
 * ```
 *
 * Use this library whenever you want to narrow down a type, either due to union types or due to
 * type inheritance.
 *
 * Unlike [[Asserts]], this does not throw any errors on failure.
 */
const Checks = {
  /**
   * Checks if the given value is an array of a single type.
   *
   * @param <T> Type of the array element.
   * @param value The value to be checked.
   * @param checkedType Constructor of the type that the array element should be.
   * @return `True` iff the value is an array whose elements are instances of the given constructor.
   */
  isArrayOf<T>(value: any, checkedType: gs.ICtor<T>): value is T[] {
    return Checks.isInstanceOf(value, Array)
        && value.every((member: any) => Checks.isInstanceOf(member, checkedType));
  },

  /**
   * Checks if the given value is a constructor.
   *
   * @param value The value to be checked.
   * @return `True` iff the value is a constructor.
   */
  isCtor(value: any): value is gs.ICtor<any> {
    return Checks.isInstanceOf<Function>(value, Function);
  },

  /**
   * Checks if the given value is an instance of the given type.
   *
   * This handles primitives like `string`, `number`, `boolean` by treating them as their non
   * primitive versions. I.e.: `String`, `Number`, and `Boolean`.
   *
   * @param <T> Type of the value.
   * @param value The value to be checked.
   * @param checkedType Constructor of the type that the value should be. For primitives like
   *    `number`, pass in the object version, `Number`.
   * @return `True` iff the value is an instance of the given constructor.
   */
  isInstanceOf<T>(value: any, checkedType: gs.ICtor<T>): value is T {
    if (checkedType === (<any> String) && typeof value === 'string') {
      return true;
    }
    if (checkedType === (<any> Boolean) && typeof value === 'boolean') {
      return true;
    }
    return value instanceof checkedType;
  },

  /**
   * Checks if the given value is a record.
   *
   * A record is an object with `string` key and any values. This particular method makes sure that
   * every member of the record is of the given type.
   *
   * @param <T> Type of the record values.
   * @param value The value to be checked.
   * @param checkedType Constructor of the type that the record values should be.
   * @return `True` iff the value is a record whos values are instances of the given constructor.
   */
  isRecordOf<T>(value: any, checkedType: gs.ICtor<T>): value is {[key: string]: T} {
    if (!Checks.isInstanceOf(value, Object)) {
      return false;
    }

    for (let key in value) {
      if (!Checks.isInstanceOf(value[key], checkedType)) {
        return false;
      }
    }

    return true;
  },
};

export default Checks;
