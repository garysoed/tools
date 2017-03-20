import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Spec } from './spec';


describe('solver.Spec', () => {
  describe('generateValues', () => {
    it('should generate the correct values', () => {
      assert(Spec.newInstance(0, 0.5, 2).generateValues()).to.equal([0, 0.5, 1, 1.5]);
    });
  });

  describe('newInstance', () => {
    it('should create the correct Spec instance', () => {
      let spec = Spec.newInstance(0, 1, 2);
      assert(spec.getStart()).to.equal(0);
      assert(spec.getDelta()).to.equal(1);
      assert(spec.getEnd()).to.equal(2);
    });

    it('should throw error if the end is smaller than the start', () => {
      assert(() => {
        Spec.newInstance(2, 1, 0);
      }).to.throwError(/BOUNDARIES/);
    });

    it('should throw error if the delta is negative', () => {
      assert(() => {
        Spec.newInstance(2, -1, 0);
      }).to.throwError(/DELTA/);
    });

    it('should throw error if the delta is zero', () => {
      assert(() => {
        Spec.newInstance(2, 0, 0);
      }).to.throwError(/DELTA/);
    });
  });
});
