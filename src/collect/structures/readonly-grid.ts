export interface GridEntry<T> {
  readonly x: number;
  readonly y: number;
  readonly value: T;
}

export interface ReadonlyGrid<T> extends Iterable<GridEntry<T>> {
  as2dArray(): ReadonlyArray<ReadonlyArray<T|undefined>>;

  get(x: number, y: number): T|undefined;
}