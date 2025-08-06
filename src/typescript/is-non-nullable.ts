export function isNonNullable<T>(target: null | T | undefined): target is T {
  return target !== null && target !== undefined;
}
