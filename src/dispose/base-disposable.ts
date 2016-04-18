import Cache from '../data/a-cache';


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
class BaseDisposable {
  private disposables_: BaseDisposable[];
  private isDisposed_: boolean;

  constructor() {
    this.disposables_ = [];
    this.isDisposed_ = false;
    if (Flags.enableTracking) {
      TRACKED_DISPOSABLES.push(this);
    }
  }

  /**
   * Adds the given disposable so they are disposed when this object is disposed.
   *
   * @param disposables Disposable objects to be disposed when this object is disposed.
   */
  addDisposable(...disposables: BaseDisposable[]): void {
    disposables.forEach((disposable: BaseDisposable) => {
      this.disposables_.push(disposable);
    });
  }

  /**
   * Override this method for custom logic that are ran during disposal.
   */
  disposeInternal(): void { /* noop */ }

  /**
   * Dispose this object.
   */
  @Cache()
  dispose(): void {
    this.disposeInternal();
    this.disposables_.forEach((disposable: BaseDisposable) => disposable.dispose());

    if (Flags.enableTracking) {
      let index = TRACKED_DISPOSABLES.indexOf(this);
      if (index >= 0) {
        TRACKED_DISPOSABLES.splice(index, 1);
      }
    }

    this.isDisposed_ = true;
  }

  /**
   * True iff the object has been disposed.
   */
  get isDisposed(): boolean {
    return this.isDisposed_;
  }
};

export default BaseDisposable;
