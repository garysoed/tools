import {assert, TestBase} from 'src/test-base';
TestBase.setup();

import {Enums} from './enums';


enum TestEnum {
  VALUE_A,
}

describe('typescript.Enums', () => {
  describe('fromLowerCaseString', () => {
    it('should return the correct enum', () => {
      assert(Enums.fromLowerCaseString('value_a', TestEnum)).to.equal(TestEnum.VALUE_A);
    });
  });

  describe('toLowerCaseString', () => {
    it('should return the correct string', () => {
      assert(Enums.toLowerCaseString(TestEnum.VALUE_A, TestEnum)).to.equal('value_a');
    });
  });
});
