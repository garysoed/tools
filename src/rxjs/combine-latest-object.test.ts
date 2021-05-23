import {assert, createSpySubject, objectThat, should, test} from 'gs-testing';
import {BehaviorSubject} from 'rxjs';

import {combineLatestObject} from './combine-latest-object';


interface Test {
  readonly a: number;
  readonly b: string;
}

test('@tools/rxjs/combine-latest-object', () => {
  should('emit the object with the latest emissions', () => {
    const a$ = new BehaviorSubject(1);
    const b$ = new BehaviorSubject('a');
    const result$ = createSpySubject(combineLatestObject({a: a$, b: b$}));

    a$.next(2);
    b$.next('b');

    assert(result$).to.emitSequence([
      objectThat<Test>().haveProperties({a: 1, b: 'a'}),
      objectThat<Test>().haveProperties({a: 2, b: 'a'}),
      objectThat<Test>().haveProperties({a: 2, b: 'b'}),
    ]);
  });
});