import {assert, TestBase} from 'src/test-base';
TestBase.setup();

import {Validate} from './validate';


describe('valid.CtorValidations', () => {
  class AncestorClass { }
  class ParentClass extends AncestorClass { }
  class ChildClass extends ParentClass { }

  describe('to.extend', () => {
    it('should pass if the child ctor is a child of the parent ctor', () => {
      let result = Validate.ctor(ChildClass).to.extend(ParentClass);
      assert(result.isValid()).to.beTrue();
    });

    it('should pass if the child ctor is a descendant of the other ctor', () => {
      let result = Validate.ctor(ChildClass).to.extend(AncestorClass);
      assert(result.isValid()).to.beTrue();
    });

    it('should pass if both ctors are the same', () => {
      let result = Validate.ctor(ChildClass).to.extend(ChildClass);
      assert(result.isValid()).to.beTrue();
    });

    it('should not pass if the child ctor is not a descendant of the other one', () => {
      let result = Validate.ctor(AncestorClass).to.extend(ParentClass);
      assert(result.isValid()).to.beFalse();
      assert(result.getErrorMessage())
          .to.match(/\[AncestorClass\] to extend ParentClass/);
    });
  });

  describe('toNot.extend', () => {
    it('should not pass if the child ctor is a child of the parent ctor', () => {
      let result = Validate.ctor(ChildClass).toNot.extend(ParentClass);
      assert(result.isValid()).to.beFalse();
      assert(result.getErrorMessage())
          .to.match(/\[ChildClass\] to not extend ParentClass/);
    });

    it('should not pass if the child ctor is a descendant of the other ctor', () => {
      let result = Validate.ctor(ChildClass).toNot.extend(AncestorClass);
      assert(result.isValid()).to.beFalse();
      assert(result.getErrorMessage())
          .to.match(/\[ChildClass\] to not extend AncestorClass/);
    });

    it('should not pass if both ctors are the same', () => {
      let result = Validate.ctor(ChildClass).toNot.extend(ChildClass);
      assert(result.isValid()).to.beFalse();
      assert(result.getErrorMessage())
          .to.match(/\[ChildClass\] to not extend ChildClass/);
    });

    it('should pass if the child ctor is not a descendant of the other one', () => {
      let result = Validate.ctor(AncestorClass).toNot.extend(ParentClass);
      assert(result.isValid()).to.beTrue();
    });
  });
});
