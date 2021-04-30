import {assert, should, test} from 'gs-testing';

import {mod} from './mod';


test('@tools/math/mod', () => {
  should('return 2 for -1 mod 3', () => {
    assert(mod(-1, 3)).to.equal(2);
  });

  should('return 2 for -7 mod 3', () => {
    assert(mod(-7, 3)).to.equal(2);
  });

  should('return 2 for 2 mod 3', () => {
    assert(mod(2, 3)).to.equal(2);
  });

  should('return 2 for 8 mod 3', () => {
    assert(mod(8, 3)).to.equal(2);
  });

  should('return 2 for -2 mod 2', () => {
    assert(mod(-2, 2)).to.equal(0);
  });
});
