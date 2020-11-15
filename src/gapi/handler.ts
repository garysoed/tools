import {EMPTY, Observable, defer, fromEventPattern, of as observableOf} from 'rxjs';
import {map, shareReplay, startWith, switchMap, switchMapTo} from 'rxjs/operators';

/**
 * Manages sign in status of the app.
 *
 * @thModule gapi
 */
export class Handler {
  /**
   * Returns Observable that emits only when the app is signed in.
   *
   * @remarks
   * If the app is not signed in, this will attempt to sign in.
   *
   * @returns `Observable` that emits only when the app is signed in.
   */
  ensureSignedIn(): Observable<unknown> {
    return this.isSignedIn()
        .pipe(
            switchMap(isSignedIn => {
              if (!isSignedIn) {
                return this.signIn().pipe(switchMapTo(EMPTY));
              }

              return observableOf(isSignedIn);
            }),
        );
  }

  /**
   * Emits true iff the app is signed in.
   *
   * @returns `Observable` that returns true iff the app is signed in.
   */
  isSignedIn(): Observable<boolean> {
    const authInstance = gapi.auth2.getAuthInstance();
    return defer(() => {
      return fromEventPattern<boolean>(
          handler => authInstance.isSignedIn.listen(signedIn => handler(signedIn)),
      );
    })
        .pipe(
            map(() => authInstance.isSignedIn.get()),
            startWith(authInstance.isSignedIn.get()),
            shareReplay({bufferSize: 1, refCount: true}),
        );
  }

  /**
   * Signs in the app.
   *
   * @returns Observable that emits when sign in is successful.
   */
  signIn(): Observable<unknown> {
    return defer(async () => {
      return gapi.auth2.getAuthInstance().signIn();
    });
  }

  /**
   * Signs out the app.
   */
  signOut(): void {
    gapi.auth2.getAuthInstance().signOut();
  }
}
