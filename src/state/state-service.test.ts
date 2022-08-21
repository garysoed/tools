import {assert, createSpySubject, run, setup, should, test} from 'gs-testing';
import {of} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {mutableState} from './mutable-state';
import {immutablePathOf} from './object-path';
import {StateService} from './state-service';


test('@tools/state/state-service', () => {
  const _ = setup(() => {
    const service = new StateService();
    return {service};
  });

  test('addRoot', () => {
    should('add the object and give it a unique ID', () => {
      const value = 'value';
      const state = mutableState(value);
      const result = _.service.addRoot(state);

      assert(result.$()).to.emitWith(value);
      assert(result._()).to.emitWith(state);
      assert(_.service.$(result.id)).to.emitWith(value);
      assert(_.service._(result.id)).to.emitWith(state);
    });
  });

  test('_', () => {
    should('emit the correct property value', () => {
      const addedId = _.service.addRoot({a: 'abc'}).id;

      assert(_.service._(addedId)._('a')).to.emitWith('abc');
    });

    should('handle mutable states', () => {
      const {id: rootId} = _.service.addRoot({
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
  });

  test('$', () => {
    should('emit the values in the path pointed by the object path', () => {
      const {id: rootId} = _.service.addRoot({
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
      const {id: rootId} = _.service.addRoot(mutableState(12));

      const root$ = createSpySubject(_.service.$(rootId));
      run(of(34).pipe(_.service.$(rootId).set()));

      assert(root$).to.emitSequence([12, 34]);
    });
  });

  test('mutablePath', () => {
    should('register mutable and immutable paths', () => {
      const {id: rootId} = _.service.addRoot({
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
