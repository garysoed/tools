import { assert, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { Spec } from './spec';


describe('solver.Spec', () => {
  describe('generateValues', () => {
    should('generate the correct values', () => {
      assert(Spec.newInstance(0, 0.5, 2).generateValues()).to.equal([0, 0.5, 1, 1.5]);
    });
  });

  describe('newInstance', () => {
    should('create the correct Spec instance', () => {
      const spec = Spec.newInstance(0, 1, 2);
      assert(spec.getStart()).to.equal(0);
      assert(spec.getDelta()).to.equal(1);
      assert(spec.getEnd()).to.equal(2);
    });

    should('throw error if the end is smaller than the start', () => {
      assert(() => {
        Spec.newInstance(2, 1, 0);
      }).to.throwError(/should not be greater than/);
    });

    should('throw error if the delta is negative', () => {
      assert(() => {
        Spec.newInstance(0, -1, 2);
      }).to.throwError(/should be > 0/);
    });

    should('throw error if the delta is zero', () => {
      assert(() => {
        Spec.newInstance(0, 0, 2);
      }).to.throwError(/should be > 0/);
    });
  });
});
