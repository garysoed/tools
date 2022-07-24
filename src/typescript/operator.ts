/**
 * Maps the input object to an output object.
 *
 * @typeParam F - Original type of the object.
 * @typeParam T - Mapped type of the object.
 * @param from - Original object to map.
 * @returns The mapped object.
 * @hidden
 */
export type Operator<F, T> = (from: F) => T;
