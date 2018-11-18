import { AssertionBuilder } from './assertion-error';

export const Errors = {
  assert(fieldName: string): AssertionBuilder {
    return new AssertionBuilder(fieldName);
  },
};
