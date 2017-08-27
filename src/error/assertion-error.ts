export class AssertionError extends Error {
  constructor(message: string) {
    super(`AssertionError: ${message}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static generic(message: string): AssertionError {
    return new AssertionError(message);
  }

  static instanceOf(expected: gs.ICtor<Object>, actual: Object): AssertionError {
    return new AssertionError(`[${actual}] is expected to be of type [${expected.name}]`);
  }
}
