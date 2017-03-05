import { assert, TestBase } from '../test-base';
TestBase.setup();

import { BooleanType } from '../check/boolean-type';
import { HasPropertyType } from '../check/has-property-type';


describe('check.HasPropertyType', () => {
  describe('check', () => {
    it('should return true if the object has the property and with the correct type', () => {
      const name = 'name';
      const target = {[name]: true};
      assert(HasPropertyType(name, BooleanType).check(target)).to.beTrue();
    });

    it('should return false if the property has the wrong type', () => {
      const name = 'name';
      const target = {[name]: 123};
      assert(HasPropertyType(name, BooleanType).check(target)).to.beFalse();
    });

    it('should return false if the object does not have the property', () => {
      assert(HasPropertyType('', BooleanType).check({})).to.beFalse();
    });
  });
});
