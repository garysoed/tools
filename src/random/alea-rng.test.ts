import { assert, should, test } from '@gs-testing';

import { $ } from '../collect/chain';
import { first } from '../collect/first';
import { map } from '../collect/map';
import { skip } from '../collect/skip';
import { take } from '../collect/take';

import { aleaRng, State } from './alea-rng';
import { Result } from './rng';

test('@tools/random/alea-rng', () => {
  should(`produce the same sequence with the same seed`, () => {
    const seed = 123;
    assert($(aleaRng(seed), map(({value}) => value), take(5))).to
        .haveElements($(aleaRng(seed), map(({value}) => value), take(5)));
  });

  should(`produce the same sequence when branched`, () => {
    const seed = 123;
    const rng = aleaRng(seed);
    const result = $(rng, first<Result<Readonly<State>>>())!;
    assert($(aleaRng(seed), skip(1), map(({value}) => value), take(5))).to
        .haveElements($(aleaRng(result.state), map(({value}) => value), take(5)));
  });
});
