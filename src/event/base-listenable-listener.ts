import { BaseListenable } from '../event/base-listenable';
import { BaseListener } from '../event/base-listener';
import { DisposableFunction } from '../interfaces/disposable-function';
import { Listener } from '../interfaces/listener';

export class BaseListenableListener<E> extends BaseListenable<E> implements Listener {
  private readonly eventHandler_: Listener;

  constructor() {
    super();
    this.eventHandler_ = new BaseListener(this);
    this.addDisposable(this.eventHandler_);
  }

  listenTo<L>(
      listenable: BaseListenable<L>,
      eventType: L,
      callback: (payload?: any) => void,
      useCapture: boolean = false): DisposableFunction {
    return this.eventHandler_.listenTo(listenable, eventType, callback, useCapture);
  }

  unlistenFrom<E>(
      listenable: BaseListenable<E>,
      eventType: E,
      callback: (payload?: any) => void,
      useCapture: boolean = false): void {
    this.eventHandler_.unlistenFrom(listenable, eventType, callback, useCapture);
  }
}
// TODO: Mutable
