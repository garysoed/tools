import { Type } from '../check/type';

class IntersectTypeBuilder<T> {
  private readonly types_: Type<any>[];

  constructor() {
    this.types_ = [];
  }

  /**
   * Adds the given type as a requirement to check.
   * @param type Type to check.
   */
  addType(type: Type<any>): IntersectTypeBuilder<T> {
    this.types_.push(type);
    return this;
  }

  /**
   * Builds the Intersect type object.
   * @return New instance of IntersectType.
   */
  build(): IntersectType<T> {
    return new IntersectType(this.types_.slice());
  }
}

/**
 * Checks if a target satisfies all of the conditions.
 *
 * This lets you add a set of types that must be satisfied for the checked object to be treated as
 * type T.
 * @param <T> Type to check.
 */
export class IntersectType<T> implements Type<T> {
  private readonly types_: Type<T>[];

  /**
   * @param types Types that the checked object should satisfy.
   */
  constructor(types: Type<T>[]) {
    this.types_ = types;
  }

  /**
   * @override
   */
  check(target: any): target is T {
    return this.types_.every((type: Type<T>) => {
      return type.check(target);
    });
  }

  toString(): string {
    const types = this.types_.map((type: Type<T>) => `${type}`).join(' & ');
    return `(${types})`;
  }

  /**
   * Creates a new builder for the intersect type.
   * @param <T> Type to check.
   * @return The builder for IntersectType.
   */
  static builder<T>(): IntersectTypeBuilder<T> {
    return new IntersectTypeBuilder<T>();
  }
}
// TODO: Mutable
