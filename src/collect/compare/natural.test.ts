import { assert, should, test } from '@gs-testing';

import { natural } from './natural';

test('@tools/collect/compare/natural', () => {
  should(`put 'a' before 'b'`, () => {
    assert(natural()('a', 'b')).to.equal(-1);
  });

  should(`put '2' before '11'`, () => {
    assert(natural()('2', '11')).to.equal(-1);
  });

  should(`put 'a2' before 'a11'`, () => {
    assert(natural()('a2', 'a11')).to.equal(-1);
  });

  should(`put '2b' before '11a'`, () => {
    assert(natural()('2b', '11a')).to.equal(-1);
  });

  should(`put '2a' before 'a'`, () => {
    assert(natural()('2a', 'a')).to.equal(-1);
  });
});
