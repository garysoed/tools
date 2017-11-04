import { Type } from '../check';

export class AssertionError extends Error {
  constructor(message: string) {
    super(`AssertionError: ${message}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static condition(field: string, expected: string, actual: any): AssertionError {
    return AssertionError.generic(`[${field}] should ${expected}, but was [${actual}]`);
  }

  static equals(field: string, expected: any, actual: any): AssertionError {
    return AssertionError.condition(field, `equal to [${expected}]`, actual);
  }

  static generic(message: string): AssertionError {
    return new AssertionError(message);
  }

  static instanceOf(field: string, expected: gs.ICtor<Object>, actual: any): AssertionError {
    return AssertionError.condition(field, `be [${expected.name}]`, actual);
  }

  static type(field: string, expected: Type<any>, actual: any): AssertionError {
    return AssertionError.condition(field, `be [${expected}]`, actual);
  }
}
