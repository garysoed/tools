import { ExtendedValue, GridData } from './type/sheets';

interface PartialSheetsCell {
  fromRow: number;
  fromColumn: number;
  toRow: number;
  toColumn: number;
  value?: ExtendedValue;
  normalized: boolean;
}

/**
 * Cell in Google Sheets.
 *
 * @thHidden
 */
export interface SheetsCell {
  readonly fromRow: number;
  readonly fromColumn: number;
  readonly toRow: number;
  readonly toColumn: number;
  readonly value: ExtendedValue;
}

/**
 * Simpler representation of Google Sheets table.
 *
 * @thHidden
 */
export type SheetsTable = ReadonlyArray<ReadonlyArray<SheetsCell>>;

/**
 * Merge data in Google Sheets.
 *
 * @thModule gapi.sheets
 */
export interface Merge {
  readonly startRowIndex: number;
  readonly endRowIndex: number;
  readonly startColumnIndex: number;
  readonly endColumnIndex: number;
}

/**
 * A raw Google Sheets table.
 *
 * @thModule gapi.sheets
 */
export interface RawSheet {
  readonly merges?: readonly Merge[];
  readonly data: readonly GridData[];
}

/**
 * Extracts a section of Google Sheets table as a `SheetsTable`.
 *
 * @remarks
 * A `SheetsTable` is a simple representation of Google Sheets table. This table is a 2D array of
 * `SheetsCell`. Cells that are merged have the same instance in different slots in the array.
 *
 * @param raw - Raw data from Google Sheet.
 * @param fromRow - Start row index.
 * @param toRow - End row index, exclusive.
 * @param fromColumn - Start column index.
 * @param toColumn - End column index, exclusive.
 * @returns Simpler representation of Google Sheets table.
 *
 * @thModule gapi.sheets
 */
export function createSheetsTable(
    raw: RawSheet,
    fromRow: number,
    toRow: number,
    fromColumn: number,
    toColumn: number,
): SheetsTable {
  const partialGrid: Array<Array<PartialSheetsCell|undefined>|undefined> = [];

  // Get all the merges.
  for (const merge of raw.merges || []) {
    const partial = {
      fromRow: merge.startRowIndex,
      fromColumn: merge.startColumnIndex,
      toRow: merge.endRowIndex,
      toColumn: merge.endColumnIndex,
      normalized: false,
    };

    for (let r = merge.startRowIndex; r < merge.endRowIndex; r++) {
      for (let c = merge.startColumnIndex; c < merge.endColumnIndex; c++) {
        const cells = partialGrid[r] || [];
        cells[c] = partial;
        partialGrid[r] = cells;
      }
    }
  }

  // Put in all the cells.
  const rowData = raw.data[0].rowData || [];
  for (let r = 0; r < rowData.length; r++) {
    const row = rowData[r];
    const partialRow = partialGrid[r] || [];

    if (!row) {
      continue;
    }

    const columns = row.values;
    if (!columns) {
      continue;
    }

    for (let c = 0; c < columns.length; c++) {
      const cell = columns[c];
      if (!cell) {
        continue;
      }

      const value = cell.effectiveValue;
      if (!value) {
        continue;
      }
      const partialCell = partialRow[c] || {
        fromRow: r,
        fromColumn: c,
        toRow: r + 1,
        toColumn: c + 1,
        normalized: false,
      };

      if (!partialCell.value) {
        partialCell.value = value;
      }

      partialRow[c] = partialCell;
    }

    partialGrid[r] = partialRow;
  }

  // Only get the selected cells.
  const table: SheetsCell[][] = [];
  for (let r = fromRow; r < toRow; r++) {
    const nr = r - fromRow;
    const tableCells = table[nr] || [];

    for (let c = fromColumn; c < toColumn; c++) {
      const partialRow = partialGrid[r] || [];
      const cell = partialRow[c];
      if (!cell || !cell.value) {
        continue;
      }

      if (!cell.normalized) {
        cell.fromRow = Math.max(cell.fromRow, fromRow) - fromRow;
        cell.fromColumn = Math.max(cell.fromColumn, fromColumn) - fromColumn;
        cell.toRow = Math.min(cell.toRow, toRow) - fromRow;
        cell.toColumn = Math.min(cell.toColumn, toColumn) - fromColumn;
        cell.normalized = true;
      }

      const nc = c - fromColumn;
      tableCells[nc] = cell as SheetsCell;
    }
    table[nr] = tableCells;
  }

  // Fill in the empty cells.
  for (let r = 0; r < toRow - fromRow; r++) {
    const cols = table[r];
    for (let c = 0; c < toColumn - fromColumn; c++) {
      const cell = cols[c];
      if (!cell) {
        cols[c] = {
          fromColumn: c,
          toColumn: c + 1,
          fromRow: r,
          toRow: r + 1,
          value: {stringValue: ''},
        };
      }
    }
    table[r] = cols;
  }

  return table;
}
