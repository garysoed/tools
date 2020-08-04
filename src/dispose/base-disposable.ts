import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { cache } from '../data/cache';

import { Disposable } from './disposable';


/**
 * Contains undisposed objects.
 */
export const TRACKED_DISPOSABLES: BaseDisposable[] = [];

/**
 * Flags to control the behavior of [[BaseDisposable]].
 */
export const Flags = {
  /**
   * Set to true to keep track of undisposed objects. This is used mainly for testing.
   */
  enableTracking: false,
};

/**
 * Base class of all disposable objects.
 */
export class BaseDisposable implements Disposable {
  private readonly disposableHandlers_: Array<() => void> = [];
  readonly isDisposed$ = new BehaviorSubject(false);

  constructor() {
    if (Flags.enableTracking) {
      TRACKED_DISPOSABLES.push(this);
    }
  }

  /**
   * Adds the given disposable so they are disposed when this object is disposed.
   *
   * @param disposables Disposable objects to be disposed when this object is disposed.
   */
  addDisposable(...disposables: Disposable[]): void {
    disposables.forEach((disposable: Disposable) => {
      this.disposableHandlers_.push(() => disposable.dispose());
    });
  }

  /**
   * Dispose this object.
   */
  dispose(): void {
    if (this.isDisposed$.getValue()) {
      return;
    }

    this.disposeInternal();
    this.disposableHandlers_.forEach(handler => handler());

    if (Flags.enableTracking) {
      const index = TRACKED_DISPOSABLES.indexOf(this);
      if (index >= 0) {
        TRACKED_DISPOSABLES.splice(index, 1);
      }
    }

    this.isDisposed$.next(true);
  }

  isDisposed(): boolean {
    return this.isDisposed$.getValue();
  }

  /**
   * Override this method for custom logic that are ran during disposal.
   */
  protected disposeInternal(): void { /* noop */ }

  @cache()
  protected get onDispose$(): Observable<{}> {
    return this.isDisposed$.pipe(filter(isDisposed => isDisposed));
  }
}
