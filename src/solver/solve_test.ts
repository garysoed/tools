import {TestBase} from '../test-base';
TestBase.setup();

import {Solve} from './solve';
import {Spec} from './spec';


describe('solver.Solve', () => {
  describe('findThreshold', () => {
    let spec;

    beforeEach(() => {
      spec = Spec.newInstance(0, 1, 10);
    });

    it('should return the correct value for 0 - 9, X < 3', () => {
      expect(Solve.findThreshold(spec, (value: number) => value < 3, true)).toEqual(2);
    });

    it('should return the correct value for 0 - 9, X < 7', () => {
      expect(Solve.findThreshold(spec, (value: number) => value < 7, true)).toEqual(6);
    });

    it('should return null for 0 - 9, X < 0', () => {
      expect(Solve.findThreshold(spec, (value: number) => value < 0, true)).toEqual(null);
    });

    it('should return 9 for 0 - 9, X <= 9', () => {
      expect(Solve.findThreshold(spec, (value: number) => value <= 9, true)).toEqual(9);
    });

    it('should return the correct value for 0 - 9, X > 3', () => {
      expect(Solve.findThreshold(spec, (value: number) => value > 3, false)).toEqual(4);
    });

    it('should return the correct value for 0 - 9, X > 7', () => {
      expect(Solve.findThreshold(spec, (value: number) => value > 7, false)).toEqual(8);
    });

    it('should return 0 for 0 - 9, X >= 0', () => {
      expect(Solve.findThreshold(spec, (value: number) => value >= 0, false)).toEqual(0);
    });

    it('should return null for 0 - 9, X > 9', () => {
      expect(Solve.findThreshold(spec, (value: number) => value > 9, false)).toEqual(null);
    });

    it('should return null for empty range', () => {
      expect(Solve.findThreshold(Spec.newInstance(2, 1, 2), () => true, true)).toEqual(null);
    });
  });
});
