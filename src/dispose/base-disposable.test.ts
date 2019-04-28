import { assert, should } from '@gs-testing';
import { createSpy, createSpyInstance, resetCalls } from '@gs-testing';
import { BaseDisposable } from './base-disposable';

/**
 * @test
 */
class DisposableClass extends BaseDisposable {

  constructor(private readonly callback_: Function) {
    super();
  }

  disposeInternal(): void {
    this.callback_();
  }
}

describe('dispose.BaseDisposable', () => {
  describe('dispose', () => {
    should('call dispose internal and dispose added disposables', () => {
      const mockDisposable = createSpyInstance(BaseDisposable);
      const callback = createSpy('callback');
      const disposable = new DisposableClass(callback);

      disposable.addDisposable(mockDisposable);
      disposable.dispose();

      assert(callback).to.haveBeenCalledWith();
      assert(mockDisposable.dispose).to.haveBeenCalledWith();
      assert(disposable.isDisposed()).to.beTrue();
    });
  });

  should('be noop if already disposed', () => {
    const callback = createSpy('callback');
    const disposable = new DisposableClass(callback);

    disposable.dispose();
    resetCalls(callback);

    disposable.dispose();
    assert(callback).toNot.haveBeenCalled();
  });
});
