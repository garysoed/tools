import { assert, should } from 'gs-testing/export/main';

import { Enums } from './enums';

/**
 * @test
 */
enum TestEnum {
  VALUE_A,
}

describe('typescript.Enums', () => {
  describe('fromLowerCaseString', () => {
    should('return the correct enum', () => {
      assert(Enums.fromLowerCaseString<TestEnum>('value_a', TestEnum)).to.equal(TestEnum.VALUE_A);
    });
  });

  describe('getAllValues_', () => {
    should('return the correct set of values', () => {
      /**
       * @test
       */
      enum Enum {A, B, C}
      assert(Enums.getAllValues<Enum>(Enum)).to.equal([Enum.A, Enum.B, Enum.C]);
    });
  });

  describe('toLowerCaseString', () => {
    should('return the correct string', () => {
      assert(Enums.toLowerCaseString(TestEnum.VALUE_A, TestEnum)).to.equal('value_a');
    });
  });
});
