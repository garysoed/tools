import { assert, should } from 'gs-testing';

import { Solve } from './solve';
import { Spec } from './spec';


describe('solver.Solve', () => {
  describe('findThreshold', () => {
    let spec: Spec;

    beforeEach(() => {
      spec = Spec.newInstance(0, 2, 20);
    });

    should('return the correct value for 0 - 18, X < 6', () => {
      assert(Solve.findThreshold(spec, (value: number) => value < 6, true)).to.equal(4);
    });

    should('return the correct value for 0 - 18, X < 14', () => {
      assert(Solve.findThreshold(spec, (value: number) => value < 14, true)).to.equal(12);
    });

    should('return null for 0 - 18, X < 0', () => {
      assert(Solve.findThreshold(spec, (value: number) => value < 0, true)).to.beNull();
    });

    should('return 9 for 0 - 18, X <= 18', () => {
      assert(Solve.findThreshold(spec, (value: number) => value <= 18, true)).to.equal(18);
    });

    should('return the correct value for 0 - 18, X > 6', () => {
      assert(Solve.findThreshold(spec, (value: number) => value > 6, false)).to.equal(8);
    });

    should('return the correct value for 0 - 18, X > 14', () => {
      assert(Solve.findThreshold(spec, (value: number) => value > 14, false)).to.equal(16);
    });

    should('return 0 for 0 - 18, X >= 0', () => {
      assert(Solve.findThreshold(spec, (value: number) => value >= 0, false)).to.equal(0);
    });

    should('return null for 0 - 18, X > 18', () => {
      assert(Solve.findThreshold(spec, (value: number) => value > 18, false)).to.beNull();
    });

    should('return null for empty range', () => {
      assert(Solve.findThreshold(Spec.newInstance(2, 1, 2), () => true, true)).to.beNull();
    });
  });
});
