import { sheets_v4 } from 'googleapis';

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
    sheetData: sheets_v4.Schema$GridData,
): ReadonlyArray<readonly sheets_v4.Schema$ExtendedValue[]> {
  const rowData = sheetData.rowData;
  if (!rowData) {
    return [];
  }

  const contents: sheets_v4.Schema$ExtendedValue[][] = [];

  for (let r = start.row; r < end.row; r++) {
    const row = rowData[r];
    if (!row) {
      continue;
    }

    const rowContents: sheets_v4.Schema$ExtendedValue[] = [];

    for (let c = start.column; c < end.column; c++) {
      const values = row.values;
      if (!values) {
        continue;
      }

      const cell = values[c];
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
    sheetData: sheets_v4.Schema$GridData,
): sheets_v4.Schema$ExtendedValue|null {
  return getCellContentByRange(
      coordinate,
      {row: coordinate.row + 1, column: coordinate.column + 1},
      sheetData,
  )[0]?.[0] || null;
}
