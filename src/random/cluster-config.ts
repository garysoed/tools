import {CoordinateSystem} from '../collect/coordinates/coordinate-system';
import {ReadonlyGrid} from '../collect/structures/readonly-grid';

export interface Range {
  readonly min: number;
  readonly max: number;
}

export interface ClusterConfig {
  readonly candidates: ReadonlyGrid<unknown>;
  readonly size: Range;
  readonly coordinate: CoordinateSystem;
}