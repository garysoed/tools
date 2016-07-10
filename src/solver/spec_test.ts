import {TestBase} from '../test-base';
TestBase.setup();

import {Spec} from './spec';


describe('solver.Spec', () => {
  describe('generateValues', () => {
    it('should generate the correct values', () => {
      expect(Spec.newInstance(0, 0.5, 2).generateValues()).toEqual([0, 0.5, 1, 1.5]);
    });
  });

  describe('newInstance', () => {
    it('should create the correct Spec instance', () => {
      let spec = Spec.newInstance(0, 1, 2);
      expect(spec.start).toEqual(0);
      expect(spec.delta).toEqual(1);
      expect(spec.end).toEqual(2);
    });

    it('should throw error if the end is smaller than the start', () => {
      expect(() => {
        Spec.newInstance(2, 1, 0);
      }).toThrowError(/BOUNDARIES/);
    });

    it('should throw error if the delta is negative', () => {
      expect(() => {
        Spec.newInstance(2, -1, 0);
      }).toThrowError(/DELTA/);
    });

    it('should throw error if the delta is zero', () => {
      expect(() => {
        Spec.newInstance(2, 0, 0);
      }).toThrowError(/DELTA/);
    });
  });
});
