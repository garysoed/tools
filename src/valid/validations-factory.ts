import { BaseValidations } from './base-validations';


/**
 * Generates an validations instance.
 *
 * @param <V> Type of the validation instance.
 */
export class ValidationsFactory<V extends BaseValidations<any>> {
  public to: V;
  public toNot: V;

  /**
   * @param provider Provider of the validations instance. This should take in one boolen, which is
   *    true iff the validation logic should be reversed.
   */
  constructor(provider: (reversed: boolean) => V) {
    this.to = provider(false);
    this.toNot = provider(true);
  }
}
