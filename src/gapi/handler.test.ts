import { assert, createSpyObject, fake, setup, should, SpyObj, test } from '@gs-testing';
import { ReplaySubject, Subject } from '@rxjs';

import { Handler } from './handler';


test('@gs-tools/gapi/handler', () => {
  let mockAuthInstance: SpyObj<gapi.auth2.GoogleAuth> & {isSignedIn: SpyObj<gapi.auth2.IsSignedIn>};
  let isSignedInSubject: Subject<boolean>;
  let handler: Handler;

  setup(() => {
    isSignedInSubject = new Subject();
    const mockIsSignedIn = createSpyObject<gapi.auth2.IsSignedIn>('IsSignedIn', ['get', 'listen']);
    fake(mockIsSignedIn.listen).always().call((handler: (signedIn: boolean) => any) => {
      isSignedInSubject.subscribe(handler);
    });

    mockAuthInstance = Object.assign<
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

    handler = new Handler();
  });

  test('ensureSignedIn', () => {
    should(`sign in and emit on success`, async () => {
      fake(mockAuthInstance.isSignedIn.get).always().returnValues(false, true);

      const subject = new ReplaySubject<unknown>(1);
      handler.ensureSignedIn().subscribe(subject);

      // Sign in.
      isSignedInSubject.next(true);

      await assert(subject).to.emit();
      assert(mockAuthInstance.signIn).to.haveBeenCalledWith();
    });

    should(`sign in and not emit on failure`, async () => {
      fake(mockAuthInstance.isSignedIn.get).always().return(false);

      const subject = new ReplaySubject<unknown>(1);
      handler.ensureSignedIn().subscribe(subject);

      await assert(subject).toNot.emit();
      assert(mockAuthInstance.signIn).to.haveBeenCalledWith();
    });

    should(`not sign in if already signed in`, async () => {
      fake(mockAuthInstance.isSignedIn.get).always().return(true);

      const subject = new ReplaySubject<unknown>(1);
      handler.ensureSignedIn().subscribe(subject);

      await assert(subject).to.emit();
      assert(mockAuthInstance.signIn).toNot.haveBeenCalled();
    });
  });

  test('isSignedIn', () => {
    should(`emit true if signed in and update its value`, async () => {
      fake(mockAuthInstance.isSignedIn.get).always().returnValues(false, true);

      const subject = new ReplaySubject(2);
      handler.isSignedIn().subscribe(subject);

      isSignedInSubject.next(true);
      await assert(subject).to.emitSequence([false, true]);
    });
  });
});
