import { TestBase } from 'gs-testing/export/main';


import { assert } from 'gs-testing/export/main';
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
      const mockDisposable = createSpyObject('Disposable', ['dispose']);
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
    callback.calls.reset();

    disposable.dispose();
    assert(callback).toNot.haveBeenCalled();
  });
});
