import {CoordinateSystem} from '../collect/coordinates/coordinate-system';
import {Vector2} from '../collect/coordinates/vector';

export interface Range {
  readonly min: number;
  readonly max: number;
}

export interface ClusterConfig {
  readonly candidates: readonly Vector2[];
  readonly size: Range;
  readonly coordinate: CoordinateSystem;
}
