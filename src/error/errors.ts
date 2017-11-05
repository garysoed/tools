import { AssertionBuilder } from '../error/assertion-error';

export const Errors = {
  assert(fieldName: string): AssertionBuilder {
    return new AssertionBuilder(fieldName);
  },
};
