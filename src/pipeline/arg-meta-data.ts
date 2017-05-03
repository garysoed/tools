/**
 * Contains metadata of a function argument.
 */
export class ArgMetaData {
  private forwardedArguments_: {[key: string]: string};
  private isExternal_: boolean;
  private key_: string;

  /**
   * @hidden
   */
  constructor(key: string, forwardedArguments: {[key: string]: string}, isExternal: boolean) {
    this.key_ = key;
    this.forwardedArguments_ = forwardedArguments;
    this.isExternal_ = isExternal;
  }

  /**
   * A mapping from external arguments required by the dependency for this argument to the external
   * argument required by this argument.
   */
  getForwardedArguments(): {[key: string]: string} {
    return this.forwardedArguments_;
  }

  /**
   * The identifier for this argument. The argument will be assigned value corresponding to this
   * key.
   */
  getKey(): string {
    return this.key_;
  }

  /**
   * True iff the argument is an external argument.
   */
  isExternal(): boolean {
    return this.isExternal_;
  }

  /**
   * Creates a new instance of the ArgMetaData.
   * @param key The identifier for this argument. The argument will be assigned value corresponding
   *    to this key.
   * @param forwardedArguments A mapping from external arguments required by the dependency for
   *    this argument to the external argument required by this argument.
   * @param isExternal True iff the argument is an external argument.
   */
  static newInstance(
      key: string,
      forwardedArguments: {[key: string]: string},
      isExternal: boolean): ArgMetaData {
    return new ArgMetaData(key, forwardedArguments, isExternal);
  }
}
