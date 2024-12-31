import {CoordinateSystem} from '../collect/coordinates/coordinate-system';
import {Vector2} from '../collect/coordinates/vector';

export interface Range {
  readonly max: number;
  readonly min: number;
}

export interface ClusterConfig {
  readonly candidates: readonly Vector2[];
  readonly coordinate: CoordinateSystem;
  readonly size: Range;
}
