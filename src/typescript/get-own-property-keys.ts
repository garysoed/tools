/**
 * Returns an array of own property keys of the given object.
 *
 * @param obj Object to return the keys of.
 * @return Array of own property keys of the given object.
 * @thModule typescript
 */
export function getOwnPropertyKeys<O extends object>(obj: O): ReadonlyArray<keyof O> {
  return Object.keys(obj).filter(key => {
    return obj.hasOwnProperty(key);
  }) as Array<keyof O>;
}
