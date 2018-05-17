import { RetryStrategy } from '../async/retry-strategy';

/**
 * Retries until the max number of retries.
 */
export class LimitedCountRetryStrategy implements RetryStrategy {
  constructor(private readonly maxRetry_: number) { }

  async onReject(): Promise<RetryStrategy | null> {
    if (this.maxRetry_ <= 0) {
      return null;
    }

    return new LimitedCountRetryStrategy(this.maxRetry_ - 1);
  }
}
