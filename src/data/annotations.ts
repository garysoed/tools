import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { hash } from '../util/hash';

export const __class = Symbol('class');

/**
 * Generic class to manage annotations.
 * @param <T> The type of value associated with the annotation.
 */
export class AnnotationsHandler<T> {
  private static readonly REGISTERED_ANNOTATIONS_: Map<string, AnnotationsHandler<any>> = new Map();
  private readonly propertyValues_: Map<string | symbol, Set<T>> =
      new Map<string | symbol, Set<T>>();

  /**
   * @param annotation The symbol to identify the annotation.
   * @param parent Pointer to the parent class to follow the annotation.
   */
  constructor(
      private readonly annotation_: symbol,
      private readonly parent_: any) { }

  /**
   * Adds the given value to the given property identifier.
   *
   * @param key Identifier of the property to attach the value to.
   * @param value The value to attach to the given property.
   */
  attachValueToProperty(key: string | symbol, value: T): void {
    let values = this.propertyValues_.get(key);
    if (!values) {
      values = new Set<T>();
      this.propertyValues_.set(key, values);
    }
    values.add(value);
  }

  /**
   * @return Names of properties with attached values.
   */
  getAnnotatedProperties(): ImmutableSet<string | symbol> {
    return this.getAttachedValues().keys();
  }

  /**
   * @return Map of property name to the value attached to that property.
   */
  getAttachedValues(): ImmutableMap<string|symbol, ImmutableList<T>> {
    const entries: Array<[string|symbol, ImmutableList<T>]> = [];
    for (const [key, values] of this.propertyValues_) {
      entries.push([key, ImmutableList.of(values)] as [string|symbol, ImmutableList<T>]);
    }

    const map = new Map(entries);
    if (this.parent_ !== null) {
      const parentAnnotationValues = AnnotationsHandler
          .of<T>(this.annotation_, this.parent_)
          .getAttachedValues();

      for (const [key, set] of parentAnnotationValues) {
        const existingSet = map.get(key) || ImmutableList.of([]);
        map.set(key, existingSet.addAll(set));
      }

      return ImmutableMap.of(map);
    } else {
      return ImmutableMap.of(map);
    }
  }

  /**
   * @param ctor The constructor to create the hash for.
   * @param annotation The annotation symbol to create the hash for.
   */
  static createHash_(ctor: any, annotation: symbol): string {
    return `${hash(ctor)}_${hash(annotation)}`;
  }

  /**
   * @param ctor The constructor to be checked.
   * @param annotation The identifier of the annotation checked.
   * @return True iff the given constructor has the given annotation identifier.
   */
  static hasAnnotation(ctor: any, annotation: symbol): boolean {
    return AnnotationsHandler.REGISTERED_ANNOTATIONS_.has(
        AnnotationsHandler.createHash_(ctor, annotation));
  }

  /**
   * @param annotation The symbol to identify the annotation.
   * @param proto The prototype to add the annotation to.
   */
  static of<T>(annotation: symbol, ctor: any): AnnotationsHandler<T> {
    const hashValue = AnnotationsHandler.createHash_(ctor, annotation);
    const handler = AnnotationsHandler.REGISTERED_ANNOTATIONS_.get(hashValue);
    if (handler !== undefined) {
      return handler;
    }

    const parentProto = Object.getPrototypeOf(ctor.prototype);
    const parent = parentProto === null ? null : parentProto.constructor;
    const newHandler = new AnnotationsHandler<T>(annotation, parent);
    AnnotationsHandler.REGISTERED_ANNOTATIONS_.set(hashValue, newHandler);

    return newHandler;
  }
}

/**
 * Generic class to manage annotations.
 */
export class Annotations<T> {
  /**
   * @param annotation The symbol to identify the annotation.
   */
  constructor(private readonly annotation_: symbol) { }

  /**
   * Creates a new handler for the given prototype.
   *
   * @param ctor The constructor to associate the annotation to.
   * @return New instance of annotations handler for the given constructor.
   */
  forCtor(ctor: any): AnnotationsHandler<T> {
    return AnnotationsHandler.of<T>(this.annotation_, ctor);
  }

  /**
   * @return True iff the given constructor has the annotation.
   */
  hasAnnotation(ctor: any): boolean {
    return AnnotationsHandler.hasAnnotation(ctor, this.annotation_);
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
