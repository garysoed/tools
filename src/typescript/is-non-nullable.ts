export function isNonNullable<T>(target: T | null | undefined): target is T {
  return target !== null && target !== undefined;
}
