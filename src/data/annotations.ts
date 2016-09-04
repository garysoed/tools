import {Arrays} from '../collection/arrays';


/**
 * Generic class to manage annotations.
 */
export class Annotations<T> {
  private fieldKeys_: (string | symbol)[] = [];

  /**
   * @param annotation_ Annotation identifier.
   * @param ctor_ Constructor of the objecto to be annotated.
   */
  constructor() { }

  /**
   * Declare the given field
   */
  addField(fieldKey: (string | symbol)): void {
    this.fieldKeys_.push(fieldKey);
  }

  /**
   * Fields annotated for the given class.
   */
  get annotatedFields(): (string | symbol)[] {
    return this.fieldKeys_;
  }

  /**
   * Returns the annotated fields recursively.
   *
   * @param instance Instance of the class to get the annotations of.
   * @return Map of the annotated field name to the field value.
   */
  getFieldValues(instance: T): Map<string | symbol, any> {
    let fields = new Map<string | symbol, any>();
    Arrays
        .of(this.annotatedFields)
        .forEach((key: string | symbol) => {
          fields.set(key, instance[key]);
        });
    return fields;
  }

  /**
   * @param ctor The constructor to be checked.
   * @param annotation The identifier of the annotation checked.
   * @return True iff the given constructor has the given annotation identifier.
   */
  static hasAnnotation(proto: any, annotation: symbol): boolean {
    return proto[annotation] !== undefined;
  }

  /**
   * Gets the annotations object for the given constructor.
   *
   * @param ctor The constructor whose annotations object should be returned.
   * @param annotation The identifier of the annotation to be returned.
   */
  static of<T>(
      proto: any,
      annotation: symbol): Annotations<T> {
    if (!Annotations.hasAnnotation(proto, annotation)) {
      proto[annotation] = new Annotations<T>();
    }
    return proto[annotation];
  }
}
