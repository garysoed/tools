import BaseDisposable, { TRACKED_DISPOSABLES, Flags } from '../dispose/base-disposable';

let DISPOSABLES = [];

export default {
  add(...disposables: BaseDisposable[]): void {
    disposables.forEach((disposable: BaseDisposable) => {
      DISPOSABLES.push(disposable);
    });
  },

  afterEach(): void {
    DISPOSABLES.forEach((disposable: BaseDisposable) => disposable.dispose());
    Flags.enableTracking = false;

    expect(TRACKED_DISPOSABLES).toEqual([]);

    TRACKED_DISPOSABLES.splice(0, TRACKED_DISPOSABLES.length);
  },


  beforeEach(): void {
    DISPOSABLES = [];
    Flags.enableTracking = true;
  },
};
