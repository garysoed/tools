import {assert, TestBase} from '../test-base';
TestBase.setup();

import {BaseDisposable} from './base-disposable';


class DisposableClass extends BaseDisposable {
  private callback_: Function;

  constructor(callback: Function) {
    super();
    this.callback_ = callback;
  }

  disposeInternal(): void {
    this.callback_();
  }
}

describe('dispose.BaseDisposable', () => {
  describe('dispose', () => {
    it('should call dispose internal and dispose added disposables', () => {
      let mockDisposable = jasmine.createSpyObj('Disposable', ['dispose']);
      let callback = jasmine.createSpy('callback');
      let disposable = new DisposableClass(callback);

      disposable.addDisposable(mockDisposable);
      disposable.dispose();

      assert(callback).to.haveBeenCalledWith();
      assert(mockDisposable.dispose).to.haveBeenCalledWith();
      assert(disposable.isDisposed).to.equal(true);
    });
  });

  it('should be noop if already disposed', () => {
    let callback = jasmine.createSpy('callback');
    let disposable = new DisposableClass(callback);

    disposable.dispose();
    callback.calls.reset();

    disposable.dispose();
    assert(callback).toNot.haveBeenCalled();
  });
});
