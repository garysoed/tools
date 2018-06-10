import { Disposable } from '../dispose/disposable';

export interface DisposableFunction extends Disposable {
  /**
   * Runs the inner function.
   */
  run(): void;
}
