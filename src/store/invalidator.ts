import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { mapTo, shareReplay, tap } from 'rxjs/operators';

/**
 * Class that maintains an observable that can emit changes to be used for invalidating.
 */
export class Invalidator {
  private readonly localInvalidatorSubject_: BehaviorSubject<null> = new BehaviorSubject(null);

  constructor(private readonly remoteInvalidatorObs_: Observable<unknown>) { }

  /**
   * Emits true iff the invalidation is local.
   */
  getObservable(): Observable<boolean> {
    return merge(
        this.localInvalidatorSubject_.pipe(mapTo(true)),
        this.remoteInvalidatorObs_.pipe(
            mapTo(false),
            shareReplay(1)),
    );
  }

  invalidate(): void {
    this.localInvalidatorSubject_.next(null);
  }
}
