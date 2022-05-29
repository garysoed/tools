import {assert, should, test} from 'gs-testing';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';

import {branch} from './branch';


function isNonNull(target: number|null): target is number {
  return target !== null;
}

test('@tools/src/rxjs/branch', () => {
  should('use the true branch if matching the condition', () => {
    assert(of(2).pipe(branch(isNonNull, map(v => v + 1), map(() => 0)))).to.emitWith(3);
  });

  should('use the false branch if not matching the condition', () => {
    assert(of(null).pipe(branch(isNonNull, map(v => v + 1), map(() => 0)))).to.emitWith(0);
  });
});