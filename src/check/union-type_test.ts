import { assert, TestBase } from '../test-base';
TestBase.setup();

import { BooleanType } from '../check/boolean-type';
import { HasPropertyType } from '../check/has-property-type';
import { UnionType } from '../check/union-type';


describe('check.UnionType', () => {
  describe('check', () => {
    it('should return true if the object satisfies some of the requirements', () => {
      const name = 'name1';
      const type = UnionType
          .builder()
          .addType(HasPropertyType(name, BooleanType))
          .build();
      const target = {[name]: true, other: 'value'};
      assert(type.check(target)).to.beTrue();
    });

    it('should return false if the object does not satisfy any of the requirements', () => {
      const name = 'name1';
      const type = UnionType
          .builder()
          .addType(HasPropertyType(name, BooleanType))
          .build();
      const target = {[name]: 123, other: 'value'};
      assert(type.check(target)).to.beFalse();
    });

    it('should return false if there are no requirements', () => {
      const target = {name1: true, name2: 'value'};
      assert(UnionType.builder().build().check(target)).to.beFalse();
    });
  });
});
