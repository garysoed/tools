import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Enums } from './enums';

/**
 * @test
 */
enum TestEnum {
  VALUE_A,
}

describe('typescript.Enums', () => {
  describe('fromLowerCaseString', () => {
    it('should return the correct enum', () => {
      assert(Enums.fromLowerCaseString<TestEnum>('value_a', TestEnum)).to.equal(TestEnum.VALUE_A);
    });
  });

  describe('getAllValues_', () => {
    it('should return the correct set of values', () => {
      /**
       * @test
       */
      enum Enum {A, B, C}
      assert(Enums.getAllValues<Enum>(Enum)).to.equal([Enum.A, Enum.B, Enum.C]);
    });
  });

  describe('toLowerCaseString', () => {
    it('should return the correct string', () => {
      assert(Enums.toLowerCaseString(TestEnum.VALUE_A, TestEnum)).to.equal('value_a');
    });
  });
});
