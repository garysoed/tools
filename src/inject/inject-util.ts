/**
 * @hidden
 */
const __METADATA = Symbol('metadata');

export class InjectUtil {

  /**
   * Gets all binding metadata for the given constructor.
   *
   * @param ctor The constructor whose metadata should be returned.
   * @return Map of binding metadata for the given constructor. The key is the parameter index. The
   *    value is the binding key for that parameter index.
   */
  static getMetadata(ctor: gs.ICtor<any>): Map<number, string | symbol> {
    if (ctor[__METADATA] === undefined) {
      ctor[__METADATA] = new Map<number, string | symbol>();
    }
    return ctor[__METADATA];
  }
}
