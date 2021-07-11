import {assert, createSpySubject, run, should, test} from 'gs-testing';
import {of} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {mutableState} from './mutable-state';
import {immutablePathOf} from './object-path';
import {createRootStateId} from './root-state-id';
import {StateService} from './state-service';


test('@tools/state/state-service', init => {
  const _ = init(() => {
    const service = new StateService();
    return {service};
  });

  test('addRoot', () => {
    should('add the object and give it a unique ID', () => {
      const value = 'value';

      const id = _.service.addRoot(value);

      assert(_.service._(id)).to.emitWith(value);
    });
  });

  test('_', _, () => {
    interface TestSimple {
      readonly a: string;
    }

    should('emit the correct property value', () => {
      const addedId = _.service.addRoot({a: 'abc'});

      assert(_.service._(addedId)._('a')).to.emitWith('abc');
    });

    should('emit undefined if the parent does not exist', () => {
      assert(_.service._(createRootStateId<TestSimple>('other'))._('a')).to.emitWith(undefined);
    });

    should('handle mutable states', () => {
      const rootId = _.service.addRoot({
        a: mutableState({
          b: {c: mutableState(12)},
        }),
      });

      const path = _.service.immutablePath(rootId, root => root.$('a')._('b')._('c'));

      const c$ = createSpySubject(_.service._(path)
          .pipe(switchMap(mutable => mutable?.value$ ?? of(undefined))));
      run(of(34).pipe(_.service._(rootId).$('a')._('b').$('c').set()));

      assert(c$).to.emitSequence([12, 34]);
    });

    should('emit undefined for undefined', () => {
      const value$ = createSpySubject(_.service._(undefined));

      assert(value$).to.emitSequence([undefined]);
    });
  });

  test('$', () => {
    should('emit the values in the path pointed by the object path', () => {
      const rootId = _.service.addRoot({
        a: mutableState({
          b: {c: mutableState(12)},
        }),
      });

      const path = _.service.immutablePath(rootId, root => root.$('a')._('b')._('c'));

      const c$ = createSpySubject(_.service.$(path));
      run(of(34).pipe(_.service._(rootId).$('a')._('b').$('c').set()));

      assert(c$).to.emitSequence([12, 34]);

      // Try overriding the entire tree. c should also be updated
      run(of({b: {c: mutableState(56)}}).pipe(_.service._(rootId).$('a').set()));

      assert(c$).to.emitSequence([12, 34, 56]);
    });

    should('handle mutable root IDs', () => {
      const rootId = _.service.addRoot(mutableState(12));

      const root$ = createSpySubject(_.service.$(rootId));
      run(of(34).pipe(_.service.$(rootId).set()));

      assert(root$).to.emitSequence([12, 34]);
    });

    should('emit undefined for undefined', () => {
      const value$ = createSpySubject(_.service.$(undefined));

      assert(value$).to.emitSequence([undefined]);
    });
  });

  test('mutablePath', () => {
    should('register mutable and immutable paths', () => {
      const rootId = _.service.addRoot({
        a: mutableState(12),
      });

      const mutablePath = _.service.mutablePath(rootId, root => root._('a'));
      const immutablePath = immutablePathOf(mutablePath);

      const mutable$ = createSpySubject(_.service.$(mutablePath));
      const immutable$ = createSpySubject(_.service._(immutablePath));
      const convertedMutable$ = createSpySubject(_.service._(immutablePathOf(mutablePath)));

      run(of(34).pipe(_.service.$(mutablePath).set()));

      assert(mutable$).to.emitSequence([12, 34]);
      assert(immutable$).to.emitSequence([12, 34]);
      assert(convertedMutable$).to.emitSequence([12, 34]);
    });
  });
});
