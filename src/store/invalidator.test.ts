import { assert, setup, should, test } from '@gs-testing/main';
import { BehaviorSubject, Subject } from 'rxjs';
import { Invalidator } from './invalidator';

test('store.Invalidator', () => {
  let remoteInvalidatorObs: Subject<null>;
  let invalidator: Invalidator;

  setup(() => {
    remoteInvalidatorObs = new Subject();
    invalidator = new Invalidator(remoteInvalidatorObs);
  });

  test('getObservable', () => {
    should(`emit when subcribing before a change`, () => {
      const beforeSubject = new BehaviorSubject<boolean|null>(null);
      invalidator.getObservable().subscribe(beforeSubject);

      assert(beforeSubject.getValue()).to.beTrue();

      remoteInvalidatorObs.next(null);
      assert(beforeSubject.getValue()).to.beFalse();

      invalidator.invalidate();
      assert(beforeSubject.getValue()).to.beTrue();
    });

    should(`emit when subcribing after a change`, () => {
      remoteInvalidatorObs.next(null);

      const afterSubject = new BehaviorSubject<boolean|null>(null);
      invalidator.getObservable().subscribe(afterSubject);

      assert(afterSubject.getValue()).to.beTrue();

      remoteInvalidatorObs.next(null);
      assert(afterSubject.getValue()).to.beFalse();
    });
  });

  test('invalidate', () => {
    should(`emit a change`, () => {
      const beforeSubject = new BehaviorSubject<boolean|null>(null);
      invalidator.getObservable().subscribe(beforeSubject);

      remoteInvalidatorObs.next(null);

      const afterSubject = new BehaviorSubject<boolean|null>(null);
      invalidator.getObservable().subscribe(afterSubject);

      invalidator.invalidate();
      assert(beforeSubject.getValue()).to.beTrue();
      assert(afterSubject.getValue()).to.beTrue();
    });
  });
});
