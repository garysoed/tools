import {BaseValidations} from './base-validations';


/**
 * Generates an validations instance.
 *
 * @param <V> Type of the validation instance.
 */
export class ValidationsFactory<V extends BaseValidations<any>> {
  private provider_: (reversed: boolean) => V;

  /**
   * @param ctor Provider of the validations instance. This should take in one boolen, which is true
   *    iff the validation logic should be reversed.
   */
  constructor(provider: (reversed: boolean) => V) {
    this.provider_ = provider;
  }

  /**
   * Generates an validations instance with normal validation logic.
   *
   * @return The newly created validations.
   */
  get to(): V {
    return this.provider_(false);
  }

  /**
   * Generates an validations instance with reversed validation logic.
   *
   * @return The newly created validations.
   */
  get toNot(): V {
    return this.provider_(true);
  }
}
