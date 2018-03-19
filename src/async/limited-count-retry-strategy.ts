import { RetryStrategy } from '../async/retry-strategy';

export class LimitedCountRetryStrategy implements RetryStrategy {
  constructor(private readonly maxRetry_: number) { }

  onReject(): Promise<RetryStrategy | null> {
    if (this.maxRetry_ <= 0) {
      return Promise.resolve(null);
    }

    return Promise.resolve(new LimitedCountRetryStrategy(this.maxRetry_ - 1));
  }
}
