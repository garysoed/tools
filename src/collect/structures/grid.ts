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

  as2dArray(): ReadonlyArray<ReadonlyArray<T|undefined>> {
    const rows: T[][] = [];
    for (const entry of this.entries) {
      const cells = rows[entry.y] ?? [];
      cells[entry.x] = entry.value;
      rows[entry.y] = cells;
    }

    return rows;
  }

  get(x: number, y: number): T|undefined {
    const entry = [...this.entries].find(entry => entry.x === x && entry.y === y);
    if (!entry) {
      return undefined;
    }

    return entry.value;
  }

  has(x: number, y: number): boolean {
    return [...this.entries].some(entry => entry.x === x && entry.y === y);
  }

  get length(): number {
    return this.entries.length;
  }

  get maxX(): number {
    return this.entries.reduce((max, curr) => {
      return Math.max(curr.x, max);
    }, Number.NEGATIVE_INFINITY);
  }

  get maxY(): number {
    return this.entries.reduce((max, curr) => {
      return Math.max(curr.y, max);
    }, Number.NEGATIVE_INFINITY);
  }

  get minX(): number {
    return this.entries.reduce((min, curr) => {
      return Math.min(curr.x, min);
    }, Number.POSITIVE_INFINITY);
  }

  get minY(): number {
    return this.entries.reduce((min, curr) => {
      return Math.min(curr.y, min);
    }, Number.POSITIVE_INFINITY);
  }

  set(x: number, y: number, value: T): this {
    this.entries = [
      ...this.entries.filter(entry => entry.x !== x || entry.y !== y),
      {x, y, value},
    ];

    return this;
  }
}

export function gridFrom<T>(arrayEntries: ReadonlyArray<readonly T[]>): Grid<T> {
  const entries: Array<GridEntry<T>> = [];
  for (let y = 0; y < arrayEntries.length; y++) {
    const cells = arrayEntries[y];
    for (let x = 0; x < cells.length; x++) {
      entries.push({x, y, value: cells[x]});
    }
  }

  return new Grid(entries);
}