import { BaseDisposable } from '../dispose/base-disposable';

/**
 * Takes several operations and makes sure that only one of them runs at any time, in a sequence.
 */
export class Sequencer extends BaseDisposable {
  private lastOperation_: Promise<any> = Promise.resolve();

  /**
   * Runs the given operation after the previous one has finished running.
   */
  async run(operation: () => Promise<any>): Promise<void> {
    this.lastOperation_ = this.lastOperation_
        .then(async () => {
          if (!this.isDisposed()) {
            return operation();
          }

          return Promise.resolve();
        })
        .catch(async (error: any) => {
          if (!this.isDisposed()) {
            return operation();
          } else {
            throw error;
          }
        });

    return this.lastOperation_;
  }
}
