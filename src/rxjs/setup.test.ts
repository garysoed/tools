import { assert, setThat, should, test } from 'gs-testing';
import { Observable, of as observableOf } from 'rxjs';
import { bufferCount, map } from 'rxjs/operators';

import { runSetup, setup } from './setup';

const __obs = Symbol('obs');
const __overidden = Symbol('overidden');
const __child = Symbol('child');

class ParentClass {
  @setup() readonly obs$ = observableOf('p');
  @setup() readonly overridden$ = observableOf('p-o');
  @setup() readonly [__obs] = observableOf('p-s');
  @setup() readonly [__overidden] = observableOf('p-s-o');
}

class ChildClass extends ParentClass {
  @setup() readonly child$ = observableOf('c');
  @setup() readonly overridden$ = observableOf('c-o');
  @setup() readonly [__child] = observableOf('c-s');
  @setup() readonly [__overidden] = observableOf('c-s-o');
}

test('@tools/rxjs/setup', () => {
  test('runSetup', () => {
    should(`merge all the observables`, () => {
      const child = new ChildClass();
      const allValues$ = runSetup(child)
          .pipe(
              bufferCount(10),
              map(values => new Set(values)),
          );
      assert(allValues$).to.emitWith(
          setThat().haveExactElements(new Set([
            'p',
            'p-s',
            'c',
            'c-o',
            'c-s',
            'c-s-o',
          ])),
      );
    });
  });
});
