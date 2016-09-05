/**
 * Generates Assert objects.
 */
export class AssertFactory<T> {
  /**
   * @param provider_ Provides the assert object. This takes in one parameter, which is true iff
   *    the assertion logic should be reversed.
   */
  constructor(private provider_: (reversed: boolean) => T) { }

  /**
   * @return Instance of the assert with no check reversals.
   */
  get to(): T {
    return this.provider_(false);
  }

  /**
   * @return Instnace of the assert with check reversal.
   */
  get toNot(): T {
    return this.provider_(true);
  }
}
