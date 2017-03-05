import { assert, TestBase } from '../test-base';
TestBase.setup();

import { BooleanType } from '../check/boolean-type';
import { HasPropertyType } from '../check/has-property-type';
import { IntersectType } from '../check/intersect-type';
import { StringType } from '../check/string-type';


describe('check.IntersectType', () => {
  describe('check', () => {
    it('should return true if the object satisfies all of the requirements', () => {
      const name1 = 'name1';
      const name2 = 'name2';
      const type = IntersectType
          .builder()
          .addType(HasPropertyType(name1, BooleanType))
          .addType(HasPropertyType(name2, StringType))
          .build();
      const target = {[name1]: true, [name2]: 'value'};
      assert(type.check(target)).to.beTrue();
    });

    it('should return false if the object does not satisfy one of the requirements', () => {
      const name1 = 'name1';
      const name2 = 'name2';
      const type = IntersectType
          .builder()
          .addType(HasPropertyType(name1, BooleanType))
          .addType(HasPropertyType(name2, BooleanType))
          .build();
      const target = {[name1]: true, [name2]: 'value'};
      assert(type.check(target)).to.beFalse();
    });

    it('should return true if there are no requirements', () => {
      const target = {name1: true, name2: 'value'};
      assert(IntersectType.builder().build().check(target)).to.beTrue();
    });
  });
});
