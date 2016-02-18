export const TRACKED_DISPOSABLES = [];
export const Flags = {
  enableTracking: false
};

export default class BaseDisposable {
  private disposables_: BaseDisposable[];

  constructor() {
    this.disposables_ = [];
    if (Flags.enableTracking) {
      TRACKED_DISPOSABLES.push(this);
    }
  }

  addDisposable(...disposables: BaseDisposable[]): void {
    disposables.forEach((disposable: BaseDisposable) => {
      this.disposables_.push(disposable);
    });
  }

  disposeInternal(): void { /* noop */ }

  dispose(): void {
    this.disposeInternal();
    this.disposables_.forEach((disposable: BaseDisposable) => disposable.dispose());

    if (Flags.enableTracking) {
      let index = TRACKED_DISPOSABLES.indexOf(this);
      if (index >= 0) {
        TRACKED_DISPOSABLES.splice(index, 1);
      }
    }
  }
};
