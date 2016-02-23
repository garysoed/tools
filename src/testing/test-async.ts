import Asyncs from '../async/asyncs';

export default {
  afterEach(): void {
    // Noop
  },

  beforeEach(): void {
    spyOn(Asyncs, 'run').and.callFake((fn: () => any) => {
      return fn();
    });
  },
};
