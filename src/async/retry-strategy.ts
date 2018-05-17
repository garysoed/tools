/**
 * Represents a retry strategy.
 */
export interface RetryStrategy {
  /**
   * Called when the previous attempt was rejected. Implemented of this method should resolve with
   * a RetryStrategy if the operation should be retried, or null otherwise. The operation will only
   * be retried after the promise resolves.
   *
   * @param error Error received from previous attempt.
   * @return Promise that will be resolved with a RetryStrategy if the operation should be retried,
   *     or null otherwise.
   */
  onReject(error: any): Promise<RetryStrategy | null>;
}
