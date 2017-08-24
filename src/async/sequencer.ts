import { BaseDisposable } from '../dispose/base-disposable';


/**
 * Takes several operations and makes sure that only one of them runs at any time, in a sequence.
 */
export class Sequencer extends BaseDisposable {
  private lastOperation_: Promise<void> = Promise.resolve();

  /**
   * Runs the given operation after the previous one has finished running.
   */
  run<T>(operation: () => Promise<T>): Promise<void> {
    const newPromise = this.lastOperation_
        .then(() => {
          if (!this.isDisposed()) {
            operation();
          }
        })
        .catch((error: any) => {
          if (!this.isDisposed()) {
            operation();
          } else {
            throw error;
          }
        });
    this.lastOperation_ = newPromise;
    return newPromise;
  }

  /**
   * Creates a new instance of the sequencer.
   */
  static newInstance(): Sequencer {
    return new Sequencer();
  }
}
