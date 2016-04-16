import TestBase from '../test-base';
TestBase.setup();

import Asserts from './asserts';


describe('asserts.CtorAsserts', () => {
  class AncestorClass { }
  class ParentClass extends AncestorClass { }
  class ChildClass extends ParentClass { }

  describe('to.extend', () => {
    it('should not throw error if the child ctor is a child of the parent ctor', () => {
      expect(() => {
        Asserts.ctor(ChildClass).to.extend(ParentClass).orThrows('error');
      }).not.toThrow();
    });

    it('should not throw error if the child ctor is a descendant of the other ctor', () => {
      expect(() => {
        Asserts.ctor(ChildClass).to.extend(AncestorClass).orThrows('error');
      }).not.toThrow();
    });

    it('should not throw error if both ctors are the same', () => {
      expect(() => {
        Asserts.ctor(ChildClass).to.extend(ParentClass).orThrows('error');
      }).not.toThrow();
    });

    it('should throw error if the child ctor is not a descendant of the other one', () => {
      expect(() => {
        Asserts.ctor(AncestorClass).to.extend(ParentClass).orThrows('error');
      }).toThrowError(/error/);
    });
  });

  describe('toNot.extend', () => {
    it('should throw error if the child ctor is a child of the parent ctor', () => {
      expect(() => {
        Asserts.ctor(ChildClass).toNot.extend(ParentClass).orThrows('error');
      }).toThrowError(/error/);
    });

    it('should throw error if the child ctor is a descendant of the other ctor', () => {
      expect(() => {
        Asserts.ctor(ChildClass).toNot.extend(AncestorClass).orThrows('error');
      }).toThrowError(/error/);
    });

    it('should throw error if both ctors are the same', () => {
      expect(() => {
        Asserts.ctor(ChildClass).toNot.extend(ParentClass).orThrows('error');
      }).toThrowError(/error/);
    });

    it('should not throw error if the child ctor is not a descendant of the other one', () => {
      expect(() => {
        Asserts.ctor(AncestorClass).toNot.extend(ParentClass).orThrows('error');
      }).not.toThrow();
    });
  });
});
