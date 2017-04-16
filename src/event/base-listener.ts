import { Maps } from '../collection/maps';
import { BaseDisposable } from '../dispose/base-disposable';
import { DisposableFunction } from '../dispose/disposable-function';
import { BaseListenable } from '../event/base-listenable';
import { Listener } from '../interfaces/listener';
import { hash } from '../util/hash';

export class BaseListener extends BaseDisposable implements Listener {
  private readonly context_: any;
  private readonly deregisterFns_: Map<string, DisposableFunction>;

  constructor(context: any = null) {
    super();
    this.context_ = context || this;
    this.deregisterFns_ = new Map<string, DisposableFunction>();
  }

  disposeInternal(): void {
    Maps.of(this.deregisterFns_).forEach((value: DisposableFunction) => {
      value.dispose();
    });
    super.disposeInternal();
  }

  private getHash_<E>(
      listenable: BaseListenable<E>,
      eventType: E,
      callback: (payload?: any) => void,
      useCapture: boolean): string {
    return`${hash(listenable)}_${hash(eventType)}_${hash(callback)}_${hash(useCapture)}`;
  }

  listenTo<E>(
      listenable: BaseListenable<E>,
      eventType: E,
      callback: (payload?: any) => void,
      useCapture: boolean = false): DisposableFunction {
    const hashValue = this.getHash_<E>(listenable, eventType, callback, useCapture);
    const existingDeregister = this.deregisterFns_.get(hashValue);
    if (existingDeregister) {
      return existingDeregister;
    }

    const deregister = listenable.on(eventType, callback, this.context_, useCapture);
    this.deregisterFns_.set(hashValue, deregister);
    return deregister;
  }

  unlistenFrom<E>(
      listenable: BaseListenable<E>,
      eventType: E,
      callback: (payload?: any) => void,
      useCapture: boolean = false): void {
    const hashValue = this.getHash_<E>(listenable, eventType, callback, useCapture);
    const deregister = this.deregisterFns_.get(hashValue);
    if (deregister) {
      deregister.dispose();
      this.deregisterFns_.delete(hashValue);
    }
  }
}
