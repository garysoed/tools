import { RetryStrategy } from './retry-strategy';

export class ExponentialBackoffRetryStrategy implements RetryStrategy {
  constructor(
      private readonly multiplierMs_: number,
      private readonly exponentBase_: number = 2,
      private readonly minTimeMs_: number = 0,
      private readonly maxTimeMs_: number = Number.POSITIVE_INFINITY,
      private readonly window_: Window = window,
      private readonly retryCount_: number = 0) { }

  onReject(): Promise<ExponentialBackoffRetryStrategy> {
    return new Promise((resolve) => {
      const delayMs = Math.min(
          Math.random() * Math.pow(this.exponentBase_, this.retryCount_) * this.multiplierMs_
              + this.minTimeMs_,
          this.maxTimeMs_);
      this.window_.setTimeout(() => {
        resolve(new ExponentialBackoffRetryStrategy(
            this.multiplierMs_,
            this.exponentBase_,
            this.minTimeMs_,
            this.maxTimeMs_,
            this.window_,
            this.retryCount_ + 1));
      }, delayMs);
    });
  }
}
