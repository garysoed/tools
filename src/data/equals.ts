import {Arrays} from 'src/collection/arrays';

import {Annotations} from './annotations';


export const ANNOTATIONS: Annotations<any> = Annotations.of<any>(Symbol('equals'));

export class Equals {
  /**
   * @param a First object to compare.
   * @param b Second object to compare.
   * @return True iff the two given objects are equal.
   */
  static equals<T>(a: T, b: T): boolean {
    if (a instanceof Object &&
        ANNOTATIONS.hasAnnotation(a.constructor)) {
      let fields = ANNOTATIONS.forCtor(a.constructor).getAnnotatedProperties();
      return Arrays.of(fields)
          .every((field: symbol | string) => {
            return Equals.equals(a[field], b[field]);
          });
    } else {
      return a === b;
    }
  }

  /**
   * Decorator to indicate that a property should be included when checking equality.
   */
  static Property(): PropertyDecorator {
    return (
        proto: Object,
        propertyKey: string | symbol): void => {
      ANNOTATIONS.forCtor(proto.constructor).attachValueToProperty(propertyKey, {});
    };
  }
}
