import { EMPTY, fromEventPattern, Observable, of as observableOf } from '@rxjs';
import { filter, map, startWith, switchMap } from '@rxjs/operators';

export class Handler {
  ensureSignedIn(): Observable<unknown> {
    return this.isSignedIn()
        .pipe(
            switchMap(isSignedIn => {
              if (!isSignedIn) {
                this.signIn();
                return EMPTY;
              }

              return observableOf(isSignedIn);
            }),
            filter(isSignedIn => isSignedIn),
        );
  }

  isSignedIn(): Observable<boolean> {
    const authInstance = gapi.auth2.getAuthInstance();
    return fromEventPattern<boolean>(
        handler => authInstance.isSignedIn.listen(signedIn => handler(signedIn)),
    )
    .pipe(
        map(() => authInstance.isSignedIn.get()),
        startWith(authInstance.isSignedIn.get()),
    );
  }

  signIn(): void {
    gapi.auth2.getAuthInstance().signIn();
  }

  signOut(): void {
    gapi.auth2.getAuthInstance().signOut();
  }
}
