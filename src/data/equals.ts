import {Annotations} from './annotations';
import {Maps} from '../collection/maps';


export const __EQUALS: symbol = Symbol('equals');

export class Equals {
  /**
   * @param a First object to compare.
   * @param b Second object to compare.
   * @return True iff the two given objects are equal.
   */
  static equals<T>(a: T, b: T): boolean {
    if (a instanceof Object &&
        Annotations.hasAnnotation(a.constructor.prototype, __EQUALS)) {
      let annotations = Annotations.of(
          <new (...args: any[]) => any> a.constructor.prototype,
          __EQUALS);
      let fieldsA = annotations.getFieldValues(a);
      let fieldsB = annotations.getFieldValues(b);
      return Maps
          .of(fieldsA)
          .all((value: any, key: string | symbol): boolean => {
            return Equals.equals(value, fieldsB.get(key));
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
      Annotations.of(proto, __EQUALS).addField(propertyKey);
    };
  }
}
