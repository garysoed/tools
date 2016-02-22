import TestBase from '../test-base';
TestBase.setup();

import Enums from './enums';


enum TestEnum {
  VALUE_A,
}

describe('typescript.Enums', () => {
  describe('fromLowerCaseString', () => {
    it('should return the correct enum', () => {
      expect(Enums.fromLowerCaseString('value_a', TestEnum)).toEqual(TestEnum.VALUE_A);
    });
  });

  describe('toLowerCaseString', () => {
    it('should return the correct string', () => {
      expect(Enums.toLowerCaseString(TestEnum.VALUE_A, TestEnum)).toEqual('value_a');
    });
  });
});
