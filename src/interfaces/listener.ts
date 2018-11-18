import { Disposable } from '../dispose/disposable';
import { DisposableFunction } from '../interfaces/disposable-function';
import { Listenable } from '../interfaces/listenable';

export interface Listener extends Disposable {
  listenTo<E>(
      listenable: Listenable<E>,
      eventType: E,
      callback: (payload?: any) => void,
      useCapture: boolean): DisposableFunction;

  unlistenFrom<E>(
      listenable: Listenable<E>,
      eventType: E,
      callback: (payload?: any) => void,
      useCapture: boolean): void;
}
// TODO: Mutable
