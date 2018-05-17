import { RetryStrategy } from '../async/retry-strategy';
import { ImmutableSet } from '../immutable';

/**
 * @see all
 */
export class AllRetryStrategy implements RetryStrategy {
  constructor(private readonly strategies_: ImmutableSet<RetryStrategy>) { }

  async onReject(error: any): Promise<RetryStrategy | null> {
    const newStrategies: RetryStrategy[] = [];
    const promises = this.strategies_.mapItem(async strategy => strategy.onReject(error));
    for (const newStrategy of await Promise.all(promises)) {
      if (!newStrategy) {
        return null;
      }

      newStrategies.push(newStrategy);
    }

    return new AllRetryStrategy(ImmutableSet.of(newStrategies));
  }
}

/**
 * Combine all the retry strategies into one retry strategy. When the attempt fails, wait for all
 * of the RetryStrategies resolves. If one of the RetryStrategies resolves with a null, no retries
 * will be attempted.
 *
 * @param strategies Retry strategies
 */
export function all(strategies: RetryStrategy[]): RetryStrategy {
  return new AllRetryStrategy(ImmutableSet.of(strategies));
}
