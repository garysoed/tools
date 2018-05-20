import { BaseListenable } from '../event/base-listenable';
import { BaseListener } from '../event/base-listener';
import { DisposableFunction } from '../interfaces/disposable-function';
import { Listener } from '../interfaces/listener';

/**
 * Base class for all listeners that may dispatch events.
 */
export class BaseListenableListener<E> extends BaseListenable<E> implements Listener {
  private readonly eventHandler_: Listener = new BaseListener(this);

  constructor() {
    super();
    this.addDisposable(this.eventHandler_);
  }

  listenTo<L>(
      listenable: BaseListenable<L>,
      eventType: L,
      callback: (payload?: any) => void,
      useCapture: boolean = false): DisposableFunction {
    return this.eventHandler_.listenTo(listenable, eventType, callback, useCapture);
  }

  unlistenFrom<L>(
      listenable: BaseListenable<L>,
      eventType: L,
      callback: (payload?: any) => void,
      useCapture: boolean = false): void {
    this.eventHandler_.unlistenFrom(listenable, eventType, callback, useCapture);
  }
}
