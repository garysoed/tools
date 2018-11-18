import { assert, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { MathRng } from './math-rng';

describe('random.MathJs', () => {
  let mathJs: MathRng;

  beforeEach(() => {
    mathJs = new MathRng();
  });

  describe('next', () => {
    should('return the value returned from Math.random', () => {
      const value = 123;
      spyOn(Math, 'random').and.returnValue(value);

      assert(mathJs.next()).to.equal(value);
    });
  });
});
