import { Annotations } from './annotations';

export const ANNOTATIONS: Annotations<any> = Annotations.of<any>(Symbol('equals'));

/**
 * @param a First object to compare.
 * @param b Second object to compare.
 * @return True iff the two given objects are equal.
 */
export function equals<T>(a: T, b: T): boolean {
  if (a instanceof Object &&
      ANNOTATIONS.hasAnnotation(a.constructor)) {
    return ANNOTATIONS
        .forCtor(a.constructor)
        .getAnnotatedProperties()
        .everyItem((field: symbol | string) => {
          return equals(a[field], b[field]);
        });
  } else {
    return a === b;
  }
}

/**
 * Decorator to indicate that a property should be included when checking equality.
 */
export function Property(): PropertyDecorator {
  return (
      proto: Object,
      propertyKey: string | symbol): void => {
    ANNOTATIONS.forCtor(proto.constructor).attachValueToProperty(propertyKey, {});
  };
}
