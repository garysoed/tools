/**
 * The resolution of an assert.
 */
class AssertResolution {
  private passes_: boolean;
  private reversed_: boolean;

  /**
   * @param passes True iff the result of the assertion passes.
   */
  constructor(passes: boolean, reversed: boolean) {
    this.passes_ = passes;
    this.reversed_ = reversed;
  }

  /**
   * Throws the error message with the given message if the assertion did not pass.
   *
   * @param message The message for the error to be thrown.
   */
  orThrows(message: string): void {
    if (this.passes_ === this.reversed_) {
      throw Error(message);
    }
  }
}

export default AssertResolution;
