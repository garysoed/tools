import {Vector2} from '../coordinates/vector';

import {GridEntry, ReadonlyGrid} from './readonly-grid';

/**
 * A 2D array.
 *
 * Unlike matrices, this uses (x, y) coordinate and can take any values.
 */
export class Grid<T = never> implements ReadonlyGrid<T> {
  private entries = [...this.entriesInput];

  constructor(private readonly entriesInput: Iterable<GridEntry<T>> = []) {}

  [Symbol.iterator](): Iterator<GridEntry<T>, any, undefined> {
    return this.entries[Symbol.iterator]();
  }

  as2dArray(): ReadonlyArray<ReadonlyArray<T | undefined>> {
    const rows: T[][] = [];
    for (const entry of this.entries) {
      const cells = rows[entry.position[1]] ?? [];
      cells[entry.position[0]] = entry.value;
      rows[entry.position[1]] = cells;
    }

    return rows;
  }

  delete([x, y]: Vector2): boolean {
    const index = this.entries.findIndex(
      ({position}) => position[0] === x && position[1] === y,
    );
    if (index < 0) {
      return false;
    }

    this.entries.splice(index, 1);

    return true;
  }

  get([x, y]: Vector2): T | undefined {
    const entry = [...this.entries].find(
      (entry) => entry.position[0] === x && entry.position[1] === y,
    );
    if (!entry) {
      return undefined;
    }

    return entry.value;
  }

  has([x, y]: Vector2): boolean {
    return [...this.entries].some(
      (entry) => entry.position[0] === x && entry.position[1] === y,
    );
  }

  get length(): number {
    return this.entries.length;
  }

  get maxX(): number {
    return this.entries.reduce((max, curr) => {
      return Math.max(curr.position[0], max);
    }, Number.NEGATIVE_INFINITY);
  }

  get maxY(): number {
    return this.entries.reduce((max, curr) => {
      return Math.max(curr.position[1], max);
    }, Number.NEGATIVE_INFINITY);
  }

  get minX(): number {
    return this.entries.reduce((min, curr) => {
      return Math.min(curr.position[0], min);
    }, Number.POSITIVE_INFINITY);
  }

  get minY(): number {
    return this.entries.reduce((min, curr) => {
      return Math.min(curr.position[1], min);
    }, Number.POSITIVE_INFINITY);
  }

  set(position: Vector2, value: T): this {
    const [x, y] = position;
    this.entries = [
      ...this.entries.filter(
        (entry) => entry.position[0] !== x || entry.position[1] !== y,
      ),
      {position, value},
    ];

    return this;
  }
}

export function gridFrom<T>(
  arrayEntries: ReadonlyArray<readonly T[]>,
): Grid<T> {
  const entries: Array<GridEntry<T>> = [];
  for (let y = 0; y < arrayEntries.length; y++) {
    const cells = arrayEntries[y];
    for (let x = 0; x < cells.length; x++) {
      entries.push({position: [x, y], value: cells[x]});
    }
  }

  return new Grid(entries);
}
