import { IType } from '../check/i-type';
import { ImmutableList } from '../immutable/immutable-list';

class UnionTypeBuilder<T> {
  private readonly types_: IType<any>[];

  constructor() {
    this.types_ = [];
  }

  /**
   * Adds the given type as a requirement to check.
   * @param type Type to check.
   */
  addType<S extends T>(type: IType<S>): UnionTypeBuilder<T> {
    this.types_.push(type);
    return this;
  }

  /**
   * Builds the Union type object.
   * @return New instance of UnionType.
   */
  build(): UnionType<T> {
    return new UnionType(this.types_.slice());
  }
}

/**
 * Checks if a target satisfies at least one of the conditions.
 *
 * This lets you add a set of types where at least one must be satisfied for the checked object to
 * be treated as type T.
 * @param <T> Type to check.
 */
export class UnionType<T> implements IType<T> {
  private readonly types_: IType<T>[];

  /**
   * @param types Types that the checked object should satisfy.
   */
  constructor(types: IType<T>[]) {
    this.types_ = types;
  }

  /**
   * @override
   */
  check(target: any): target is T {
    return ImmutableList
        .of(this.types_)
        .some((type: IType<T>) => {
          return type.check(target);
        });
  }

  /**
   * Creates a new builder for the union type.
   * @param <T> Type to check.
   * @return The builder for UnionType.
   */
  static builder<T>(): UnionTypeBuilder<T> {
    return new UnionTypeBuilder<T>();
  }
}
