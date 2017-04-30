import { Disposable } from '../interfaces/disposable';

export interface DisposableFunction extends Disposable {
  /**
   * Runs the inner function.
   */
  run(): void;
}
