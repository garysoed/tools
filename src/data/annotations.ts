import {Arrays} from '../collection/arrays';
import {Maps} from '../collection/maps';


/**
 * Generic class to manage annotations.
 * @param <T> The type of value associated with the annotation.
 */
export class AnnotationsHandler<T> {
  private annotation_: symbol;
  private propertyValues_: Map<string | symbol, T>;
  private parent_: any;

  /**
   * @param annotation The symbol to identify the annotation.
   * @param parent Pointer to the parent class to follow the annotation.
   */
  constructor(annotation: symbol, parent: any) {
    this.annotation_ = annotation;
    this.parent_ = parent;
    this.propertyValues_ = new Map<string | symbol, T>();
  }

  /**
   * Adds the given value to the given property identifier.
   *
   * @param key Identifier of the property to attach the value to.
   * @param value The value to attach to the given property.
   */
  attachValueToProperty(key: string | symbol, value: T): void {
    this.propertyValues_.set(key, value);
  }

  /**
   * @return Names of properties with attached values.
   */
  getAnnotatedProperties(): (string | symbol)[] {
    return Arrays.fromIterator(this.getAttachedValues().keys()).asArray();
  }

  /**
   * @return Map of property name to the value attached to that property.
   */
  getAttachedValues(): Map<string | symbol, T> {
    let fluentMappable = Maps.of(this.propertyValues_);
    if (this.parent_ !== null) {
      let parentAnnotationValues = AnnotationsHandler
          .of<T>(this.annotation_, this.parent_)
          .getAttachedValues();
      fluentMappable = fluentMappable.addAllMap(parentAnnotationValues);
    }
    return fluentMappable.asMap();
  }

  /**
   * @param proto The prototype to be checked.
   * @param annotation The identifier of the annotation checked.
   * @return True iff the given prototype has the given annotation identifier.
   */
  static hasAnnotation(proto: any, annotation: symbol): boolean {
    return proto[annotation] !== undefined;
  }

  /**
   * @param annotation The symbol to identify the annotation.
   * @param proto The prototype to add the annotation to.
   * @param parent Pointer to the parent class to follow the annotation.
   */
  static of<T>(annotation: symbol, proto: any, parent: any = null): AnnotationsHandler<T> {
    if (!AnnotationsHandler.hasAnnotation(proto, annotation)) {
      proto[annotation] = new AnnotationsHandler<T>(annotation, parent);
    }
    return proto[annotation];
  }
}

/**
 * Generic class to manage annotations.
 */
export class Annotations<T> {
  private annotation_: symbol;

  /**
   * @param annotation The symbol to identify the annotation.
   */
  constructor(annotation: symbol) {
    this.annotation_ = annotation;
  }

  /**
   * Creates a new handler for the given prototype.
   *
   * @param proto The prototype to associate the annotation to.
   * @param parent The parent class of the prototype.
   * @return New instance of annotations handler for the given prototype.
   */
  forPrototype(proto: any, parent: any = null): AnnotationsHandler<T> {
    return AnnotationsHandler.of<T>(this.annotation_, proto, parent);
  }

  /**
   * @return True iff the given prototype has the annotation.
   */
  hasAnnotation(proto: any): boolean {
    return AnnotationsHandler.hasAnnotation(proto, this.annotation_);
  }

  /**
   * Gets the annotations object for the given constructor.
   *
   * @param annotation The identifier of the annotation to be returned.
   */
  static of<T>(annotation: symbol): Annotations<T> {
    return new Annotations<T>(annotation);
  }
}
