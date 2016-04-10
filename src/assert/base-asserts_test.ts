import TestBase from '../test-base';
TestBase.setup();

import BaseAsserts from './base-asserts';


describe('assert.BaseAsserts', () => {
  describe('resolve', () => {
    it('should create the resolution object correctly', () => {
      let reversed = true;
      let passes = true;
      let asserts = new BaseAsserts<string>('value', reversed);
      let resolution = asserts.resolve(passes);

      expect(resolution['passes_']).toEqual(passes);
      expect(resolution['reversed_']).toEqual(reversed);
    });
  });
});
