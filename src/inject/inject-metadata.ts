/**
 * Metadata for injected parameters.
 */
export class InjectMetadata {

  /**
   * @hidden
   */
  constructor(
      private keyName_: string | symbol,
      private isOptional_: boolean) { }

  /**
   * The injection key of the parameter.
   */
  getKeyName(): string | symbol {
    return this.keyName_;
  }

  /**
   * True iff the injection parameter is optional.
   */
  isOptional(): boolean {
    return this.isOptional_;
  }

  /**
   * Creates a new instance of the injection metadata object.
   *
   * @param keyName Injection key of the parameter.
   * @param isOptional True iff the injection parameter is optional. Defaults to false.
   * @return The newly instantiated metadata object.
   */
  static newInstance(keyName: string | symbol, isOptional: boolean = false): InjectMetadata {
    return new InjectMetadata(keyName, isOptional);
  }
}
