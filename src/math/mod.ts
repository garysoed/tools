/**
 * Computes the mod value for the given base.
 *
 * @remarks
 * Unlike the built in mod, this works with negative numbers.
 *
 * @param value - Value whose mod should be counted.
 * @param base - Base for the mod.
 * @returns `value` % `base`
 * @thModule math
 */
export function mod(value: number, base: number): number {
  return value - base * Math.floor(value / base);
}
