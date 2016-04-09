/**
 * Generates an asserts instance.
 *
 * @param <A> Type of the assert instance.
 */
class AssertsFactory<A> {
  private ctor_: new (reversed: boolean) => A;

  /**
   * @param ctor Constructor of the assert instance. This should accept one argument, which is set
   *    to true iff the assertion logic should be reversed.
   */
  constructor(ctor: new (reversed: boolean) => A) {
    this.ctor_ = ctor;
  }

  /**
   * Generates an asserts instance with normal assertion logic.
   *
   * @return The newly created asserts.
   */
  get is(): A {
    return new this.ctor_(false);
  }

  /**
   * Generates an asserts instance with reversed assertion logic.
   *
   * @return The newly created asserts.
   */
  get isNot(): A {
    return new this.ctor_(true);
  }
}

export default AssertsFactory;
