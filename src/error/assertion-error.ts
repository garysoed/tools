import { Type } from 'gs-types';

export class AssertionShouldBuilder {
  constructor(
      private readonly fieldName_: string,
      private readonly condition_: string) { }

  butNot(): AssertionError {
    return this.createAssertionError_('not');
  }

  butWas(actual: any): AssertionError {
    return this.createAssertionError_(`was [${actual}]`);
  }

  private createAssertionError_(but: string): AssertionError {
    return new AssertionError(
        `[${this.fieldName_}] should ${this.condition_}, but ${but}`);
  }
}

export class AssertionBuilder {
  constructor(private readonly fieldName_: string) { }

  should(condition: string): AssertionShouldBuilder {
    return new AssertionShouldBuilder(this.fieldName_, condition);
  }

  shouldBe(expected: any): AssertionShouldBuilder {
    return this.should(`be [${expected}]`);
  }

  shouldBeA(type: Type<any>): AssertionShouldBuilder {
    return this.should(`be a [${type}]`);
  }

  shouldBeAnInstanceOf(expected: new (...args: any[]) => Object): AssertionShouldBuilder {
    return this.should(`be an instance of [${expected.name}]`);
  }

  shouldExist(): AssertionShouldBuilder {
    return this.should('exist');
  }
}

export class AssertionError extends Error {
  constructor(message: string) {
    super(`AssertionError: ${message}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
