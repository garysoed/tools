import {Vector2} from '../coordinates/vector';

export interface GridEntry<T> {
  readonly position: Vector2;
  readonly value: T;
}

export interface ReadonlyGrid<T> extends Iterable<GridEntry<T>> {
  as2dArray(): ReadonlyArray<ReadonlyArray<T | undefined>>;

  get(location: Vector2): T | undefined;

  has(location: Vector2): boolean;

  readonly length: number;
  readonly maxX: number;
  readonly maxY: number;
  readonly minX: number;
  readonly minY: number;
  readonly positions: readonly Vector2[];
}
