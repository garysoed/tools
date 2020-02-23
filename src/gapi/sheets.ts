import { ExtendedValue, GridData } from './type/sheets';

export interface Coordinate {
  readonly column: number;
  readonly row: number;
}

/**
 * Given the range, return the values of the cells in the range.
 */
export function getCellContentByRange(
    start: Coordinate,
    end: Coordinate,
    sheetData: GridData,
): ReadonlyArray<ReadonlyArray<ExtendedValue|undefined>> {
  const rowData = sheetData.rowData;
  if (!rowData) {
    return [];
  }

  const contents: ExtendedValue[][] = [];

  for (let r = start.row; r < end.row; r++) {
    const row = rowData[r];
    if (!row) {
      continue;
    }

    const rowContents: ExtendedValue[] = [];

    for (let c = start.column; c < end.column; c++) {
      const values = row.values;
      if (!values) {
        continue;
      }

      const cell = values[c];
      if (!cell) {
        continue;
      }

      const value = cell.effectiveValue;
      if (value) {
        rowContents[c - start.column] = value;
      }
    }

    contents[r - start.row] = rowContents;
  }

  return contents;
}

export function getCellContent(
    coordinate: Coordinate,
    sheetData: GridData,
): ExtendedValue|null {
  return getCellContentByRange(
      coordinate,
      {row: coordinate.row + 1, column: coordinate.column + 1},
      sheetData,
  )[0]?.[0] || null;
}
