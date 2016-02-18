import BaseDisposable, { TRACKED_DISPOSABLES, Flags } from '../base-disposable';

export default {
  setup(global: any): void {
    let DISPOSABLES = [];

    global['addDisposable'] = (disposable: BaseDisposable) => {
      DISPOSABLES.push(disposable);
    };

    beforeEach(() => {
      DISPOSABLES = [];
      Flags.enableTracking = true;
    });

    afterEach(() => {
      DISPOSABLES.forEach(disposable => disposable.dispose());
      Flags.enableTracking = false;

      expect(TRACKED_DISPOSABLES).toEqual([]);

      TRACKED_DISPOSABLES.splice(0, TRACKED_DISPOSABLES.length);
    });
  }
};
