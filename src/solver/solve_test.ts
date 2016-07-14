import {TestBase} from '../test-base';
TestBase.setup();

import {Solve} from './solve';
import {Spec} from './spec';


describe('solver.Solve', () => {
  describe('findThreshold', () => {
    let spec;

    beforeEach(() => {
      spec = Spec.newInstance(0, 2, 20);
    });

    it('should return the correct value for 0 - 18, X < 6', () => {
      expect(Solve.findThreshold(spec, (value: number) => value < 6, true)).toEqual(4);
    });

    it('should return the correct value for 0 - 18, X < 14', () => {
      expect(Solve.findThreshold(spec, (value: number) => value < 14, true)).toEqual(12);
    });

    it('should return null for 0 - 18, X < 0', () => {
      expect(Solve.findThreshold(spec, (value: number) => value < 0, true)).toEqual(null);
    });

    it('should return 9 for 0 - 18, X <= 18', () => {
      expect(Solve.findThreshold(spec, (value: number) => value <= 18, true)).toEqual(18);
    });

    it('should return the correct value for 0 - 18, X > 6', () => {
      expect(Solve.findThreshold(spec, (value: number) => value > 6, false)).toEqual(8);
    });

    it('should return the correct value for 0 - 18, X > 14', () => {
      expect(Solve.findThreshold(spec, (value: number) => value > 14, false)).toEqual(16);
    });

    it('should return 0 for 0 - 18, X >= 0', () => {
      expect(Solve.findThreshold(spec, (value: number) => value >= 0, false)).toEqual(0);
    });

    it('should return null for 0 - 18, X > 18', () => {
      expect(Solve.findThreshold(spec, (value: number) => value > 18, false)).toEqual(null);
    });

    it('should return null for empty range', () => {
      expect(Solve.findThreshold(Spec.newInstance(2, 1, 2), () => true, true)).toEqual(null);
    });
  });
});
