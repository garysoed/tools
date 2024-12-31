import {Vector2} from '../coordinates/vector';

import {GridEntry, ReadonlyGrid} from './readonly-grid';

/**
 * A 2D array.
 *
 * Unlike matrices, this uses (x, y) coordinate and can take any values.
 */
export class Grid<T = never> implements ReadonlyGrid<T> {
  private readonly entriesMap = new Map(asEntryMap(this.entriesInput));

  constructor(private readonly entriesInput: Iterable<GridEntry<T>> = []) {}

  as2dArray(): ReadonlyArray<ReadonlyArray<T | undefined>> {
    const rows: T[][] = [];
    for (const [positionStr, value] of this.entriesMap) {
      const position = fromPositionStr(positionStr);
      const cells = rows[position[1]] ?? [];
      cells[position[0]] = value;
      rows[position[1]] = cells;
    }

    return rows;
  }
  delete(position: Vector2): boolean {
    return this.entriesMap.delete(toPositionStr(position));
  }
  get(position: Vector2): T | undefined {
    return this.entriesMap.get(toPositionStr(position));
  }
  has(position: Vector2): boolean {
    return this.entriesMap.has(toPositionStr(position));
  }
  set(position: Vector2, value: T): this {
    this.entriesMap.set(toPositionStr(position), value);
    return this;
  }
  [Symbol.iterator](): Iterator<GridEntry<T>, any, undefined> {
    const entriesArray = [];
    for (const [positionStr, value] of this.entriesMap) {
      entriesArray.push({position: fromPositionStr(positionStr), value});
    }
    return entriesArray[Symbol.iterator]();
  }

  get length(): number {
    return this.entriesMap.size;
  }
  get maxX(): number {
    return this.positions
      .map((position) => position[0])
      .reduce((max, curr) => Math.max(curr, max), Number.NEGATIVE_INFINITY);
  }
  get maxY(): number {
    return this.positions
      .map((position) => position[1])
      .reduce((max, curr) => Math.max(curr, max), Number.NEGATIVE_INFINITY);
  }
  get minX(): number {
    return this.positions
      .map((position) => position[0])
      .reduce((min, curr) => Math.min(curr, min), Number.POSITIVE_INFINITY);
  }
  get minY(): number {
    return this.positions
      .map((position) => position[1])
      .reduce((min, curr) => Math.min(curr, min), Number.POSITIVE_INFINITY);
  }
  get positions(): readonly Vector2[] {
    return [...this.entriesMap.keys()].map((positionStr) =>
      fromPositionStr(positionStr),
    );
  }
}

function asEntryMap<T>(
  entries: Iterable<GridEntry<T>>,
): ReadonlyMap<string, T> {
  const entriesMap = new Map<string, T>();
  for (const entry of entries) {
    entriesMap.set(toPositionStr(entry.position), entry.value);
  }
  return entriesMap;
}

export function toPositionStr(position: Vector2): string {
  return `${position[0]}_${position[1]}`;
}

function fromPositionStr(positionStr: string): Vector2 {
  const [x, y] = positionStr
    .split('_')
    .map((position) => Number.parseFloat(position));
  if (x === undefined || y === undefined) {
    throw new Error(`position string ${positionStr} is invalid`);
  }
  return [x, y];
}

export function gridFrom<T>(
  arrayEntries: ReadonlyArray<readonly T[]>,
): Grid<T> {
  const entries: Array<GridEntry<T>> = [];
  arrayEntries.forEach((cells, y) => {
    cells.forEach((value, x) => {
      entries.push({position: [x, y], value});
    });
  });
  return new Grid(entries);
}
