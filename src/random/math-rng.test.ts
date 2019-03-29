import { assert, should } from '@gs-testing/main';
import { fake, spy } from '@gs-testing/spy';
import { MathRng } from './math-rng';

describe('random.MathJs', () => {
  let mathJs: MathRng;

  beforeEach(() => {
    mathJs = new MathRng();
  });

  describe('next', () => {
    should('return the value returned from Math.random', () => {
      const value = 123;
      fake(spy(Math, 'random')).always().return(value);

      assert(mathJs.next()).to.equal(value);
    });
  });
});
