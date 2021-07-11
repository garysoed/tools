import {assert, createSpySubject, run, should, test} from 'gs-testing';
import {of} from 'rxjs';

import {mutableState} from './mutable-state';
import {StateService} from './state-service';

test('@tools/src/state/resolver', init => {
  const _ = init(() => {
    const service = new StateService();
    return {service};
  });

  test('set', () => {
    should('update the value of the mutable state', () => {
      const addedId = _.service.addRoot({
        a: mutableState('abc'),
      });

      const a$ = createSpySubject(_.service._(addedId).$('a'));
      run(of('xyz').pipe(_.service._(addedId).$('a').set()));

      assert(a$).to.emitSequence(['abc', 'xyz']);
    });
  });
});