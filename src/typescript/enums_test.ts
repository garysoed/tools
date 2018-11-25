import { assert, should, test } from 'gs-testing/export/main';
import { Enums } from './enums';

/**
 * @test
 */
enum TestEnum {
  VALUE_A,
}

test('typescript.Enums', () => {
  test('fromLowerCaseString', () => {
    should('return the correct enum', () => {
      assert(Enums.fromLowerCaseString<TestEnum>('value_a', TestEnum)).to.equal(TestEnum.VALUE_A);
    });
  });

  test('getAllValues_', () => {
    should('return the correct set of values', () => {
      /**
       * @test
       */
      enum Enum {A, B, C}
      assert(Enums.getAllValues<Enum>(Enum)).to.haveExactElements([Enum.A, Enum.B, Enum.C]);
    });
  });

  test('toLowerCaseString', () => {
    should('return the correct string', () => {
      assert(Enums.toLowerCaseString(TestEnum.VALUE_A, TestEnum)).to.equal('value_a');
    });
  });
});
