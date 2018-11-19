import { InjectMetadata } from './inject-metadata';


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
  static getMetadataMap(ctor: gs.ICtor<any>): Map<number, InjectMetadata> {
    // TODO: Don't typecast.
    if ((ctor as any)[__METADATA] === undefined) {
      (ctor as any)[__METADATA] = new Map<number, InjectMetadata>();
    }
    return (ctor as any)[__METADATA];
  }
}
