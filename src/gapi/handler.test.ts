import {SpyObj, assert, createSpyObject, createSpySubject, fake, should, setup, teardown, test, asyncAssert} from 'gs-testing';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {Handler} from './handler';


test('@gs-tools/gapi/handler', () => {
  const _ = setup(() => {
    const onTestDone$ = new Subject<void>();
    const isSignedIn$ = new Subject<boolean>();
    const mockIsSignedIn = createSpyObject<gapi.auth2.IsSignedIn>('IsSignedIn', ['get', 'listen']);
    fake(mockIsSignedIn.listen).always().call((handler: (signedIn: boolean) => any) => {
      isSignedIn$.pipe(takeUntil(onTestDone$)).subscribe(handler);
    });

    const mockAuthInstance = Object.assign<
        SpyObj<gapi.auth2.GoogleAuth>,
        {isSignedIn: SpyObj<gapi.auth2.IsSignedIn>}
    >(
        createSpyObject('AuthInstance', ['signIn']),
        {isSignedIn: mockIsSignedIn},
    );
    Object.assign(window, {
      gapi: {
        auth2: {
          getAuthInstance: () => mockAuthInstance,
        },
      },
    });

    const handler = new Handler();

    return {
      handler,
      isSignedInSubject: isSignedIn$,
      mockAuthInstance,
      onTestDone$,
    };
  });

  teardown(() => {
    _.onTestDone$.next();
    _.onTestDone$.complete();
  });

  test('ensureSignedIn', () => {
    should('sign in and emit on success', async () => {
      fake(_.mockAuthInstance.isSignedIn.get).always().returnValues(false, true);

      const subject = createSpySubject(_.handler.ensureSignedIn());

      // Sign in.
      _.isSignedInSubject.next(true);

      await asyncAssert(subject).to.emit();
      assert(_.mockAuthInstance.signIn).to.haveBeenCalledWith();
    });

    should('sign in and not emit on failure', async () => {
      fake(_.mockAuthInstance.isSignedIn.get).always().return(false);

      const subject = createSpySubject(_.handler.ensureSignedIn());

      await asyncAssert(subject).toNot.emit();
      assert(_.mockAuthInstance.signIn).to.haveBeenCalledWith();
    });

    should('not sign in if already signed in', async () => {
      fake(_.mockAuthInstance.isSignedIn.get).always().return(true);

      const subject = createSpySubject(_.handler.ensureSignedIn());

      await asyncAssert(subject).to.emit();
      assert(_.mockAuthInstance.signIn).toNot.haveBeenCalled();
    });
  });

  test('isSignedIn', () => {
    should('emit true if signed in and update its value', async () => {
      fake(_.mockAuthInstance.isSignedIn.get).always().returnValues(false, true);

      const subject = createSpySubject(_.handler.isSignedIn());

      _.isSignedInSubject.next(true);
      await asyncAssert(subject).to.emitSequence([false, true]);
    });
  });
});
