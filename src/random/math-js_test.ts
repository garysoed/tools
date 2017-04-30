import { assert, TestBase } from '../test-base';
TestBase.setup();

import { MathJs } from './math-js';


describe('random.MathJs', () => {
  let mathJs: MathJs;

  beforeEach(() => {
    mathJs = new MathJs();
  });

  describe('next', () => {
    it('should return the value returned from Math.random', () => {
      const value = 123;
      spyOn(Math, 'random').and.returnValue(value);

      assert(mathJs.next()).to.equal(value);
    });
  });
});
