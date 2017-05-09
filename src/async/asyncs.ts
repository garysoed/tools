/**
 * Collection of miscellaneous methods to do asynchronous operations.
 */
export class Asyncs {
  /**
   * Runs the given function asynchronously.
   *
   * @param <T> Return type of the given function.
   * @param fn The function to run.
   * @return Promise that will be resolved when the function has finished running.
   */
  static run<T>(fn: () => T): Promise<T> {
    return new Promise((resolve: Function) => {
      window.setTimeout(() => {
        resolve(fn());
      }, 0);
    });
  }
}
