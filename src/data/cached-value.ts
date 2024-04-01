interface UninitializedState {
  readonly initialized: false;
}

interface InitializedState<T> {
  readonly initialized: true;
  readonly value: T;
}

type CacheState<T> = InitializedState<T> | UninitializedState;

export class CachedValue<T> {
  private state: CacheState<T> = {initialized: false};

  constructor(private readonly provider: () => T) {}

  get value(): T {
    if (this.state.initialized) {
      return this.state.value;
    }

    const newValue = this.provider();
    this.state = {initialized: true, value: newValue};
    return newValue;
  }
}
