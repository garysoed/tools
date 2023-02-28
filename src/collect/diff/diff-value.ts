export function diffValue<T>(
    a: T|undefined,
    b: T|undefined,
    helper: (a: T, b: T) => boolean,
): boolean {
  if (a !== undefined && b !== undefined) {
    return helper(a, b);
  }

  return a === b;
}