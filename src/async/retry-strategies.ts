import { RetryStrategy } from '../async/retry-strategy';
import { ImmutableSet } from '../immutable';

export class AllRetryStrategy implements RetryStrategy {
  constructor(private readonly strategies_: ImmutableSet<RetryStrategy>) { }

  async onReject(error: any): Promise<RetryStrategy | null> {
    const newStrategies: RetryStrategy[] = [];
    const promises = this.strategies_.mapItem((strategy) => strategy.onReject(error));
    for (const newStrategy of await Promise.all(promises)) {
      if (!newStrategy) {
        return null;
      }

      newStrategies.push(newStrategy);
    }

    return new AllRetryStrategy(ImmutableSet.of(newStrategies));
  }
}

export class RetryStrategies {
  static all(strategies: RetryStrategy[]): RetryStrategy {
    return new AllRetryStrategy(ImmutableSet.of(strategies));
  }
}
