import { assert, setThat, should, test } from 'gs-testing';
import { Observable, of as observableOf } from 'rxjs';
import { bufferCount, map } from 'rxjs/operators';

import { runSetup, setup } from './setup';

const __getter = Symbol('getter');
const __overiddenGetter = Symbol('overriddenGetter');
const __childGetter = Symbol('childGetter');

class ParentClass {
  @setup()
  get getter$(): Observable<string> {
    return observableOf('p-g');
  }

  @setup()
  get overiddenGetter$(): Observable<string> {
    return observableOf('p-g-o');
  }

  @setup()
  get [__getter](): Observable<string> {
    return observableOf('p-g-s');
  }

  @setup()
  get [__overiddenGetter](): Observable<string> {
    return observableOf('p-g-s-o');
  }
}

class ChildClass extends ParentClass {
  @setup()
  get childGetter$(): Observable<string> {
    return observableOf('c-g');
  }

  @setup()
  get overiddenGetter$(): Observable<string> {
    return observableOf('c-g-o');
  }

  @setup()
  get [__childGetter](): Observable<string> {
    return observableOf('c-g-s');
  }

  @setup()
  get [__overiddenGetter](): Observable<string> {
    return observableOf('c-g-s-o');
  }
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
            'p-g',
            'p-g-s',
            'c-g',
            'c-g-o',
            'c-g-s',
            'c-g-s-o',
          ])),
      );
    });
  });
});
