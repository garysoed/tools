import { asArray } from '../collect/operators/as-array';
import { flat } from '../collect/operators/flat';
import { $pipe } from '../collect/operators/pipe';

import { SheetsCell, SheetsTable } from './sheets-table';
import { ExtendedValue } from './type/sheets';

export interface SingleCell {
  readonly isSingle: true;
  readonly value: ExtendedValue;
}

export interface MultiCell {
  readonly isSingle: false;
  readonly value: SheetsTable;
}

export type Cell = SingleCell|MultiCell;
export interface Table {
  readonly cols: readonly Cell[];
  readonly rows: readonly Cell[];
  readonly data: ReadonlyArray<readonly Cell[]>;
}

interface Index {
  readonly start: number;
  readonly count: number;
}

export function defineTable(sheetsTable: SheetsTable): Table {
  const colIndex = getColIndex(sheetsTable);
  const rowIndex = getRowIndex(sheetsTable);

  const [cols] = getCells([{start: 0, count: 1}], colIndex, sheetsTable);
  const rows = $pipe(
      getCells(rowIndex, [{start: 0, count: 1}], sheetsTable),
      flat(),
      asArray(),
  );
  const data = getCells(rowIndex, colIndex, sheetsTable);
  return {cols, rows, data};
}

function getCells(
    rowIndex: readonly Index[],
    colIndex: readonly Index[],
    sheetsTable: SheetsTable,
): ReadonlyArray<readonly Cell[]> {
  const rows: Cell[][] = [];
  for (const ri of rowIndex) {
    const cols: Cell[] = [];
    for (const ci of colIndex) {
      if (ri.count === 1 && ci.count === 1) {
        cols.push({
          isSingle: true,
          value: sheetsTable[ri.start][ci.start].value,
        });
        continue;
      }

      const ids = new Set<SheetsCell>();
      const subRows: SheetsCell[][] = [];
      for (let r = ri.start; r < ri.start + ri.count; r++) {
        const subCols: SheetsCell[] = [];
        for (let c = ci.start; c < ci.start + ci.count; c++) {
          const sheetsCell = sheetsTable[r][c];
          ids.add(sheetsCell);
          subCols.push(sheetsCell);
        }
        subRows.push(subCols);
      }

      // Check if there is only one cell. If there is, only add that one.
      if (ids.size === 1) {
        cols.push({isSingle: true, value: subRows[0][0].value});
      } else {
        cols.push({isSingle: false, value: subRows});
      }
    }
    rows.push(cols);
  }

  return rows;
}

/**
 * Returns an array of starting col indexes.
 */
function getColIndex(sheetsTable: SheetsTable): readonly Index[] {
  const [colRow] = sheetsTable;
  const [rowCol] = colRow;

  let curr = colRow[rowCol.toColumn];
  const indexes: Index[] = [];
  while (curr) {
    indexes.push({start: curr.fromColumn, count: curr.toColumn - curr.fromColumn});
    curr = colRow[curr.toColumn];
  }

  return indexes;
}

function getRowIndex(sheetsTable: SheetsTable): readonly Index[] {
  const colRow = sheetsTable[0];
  const [rowCol] = colRow;
  let curr = sheetsTable[rowCol.toRow];
  const indexes: Index[] = [];
  while (curr && curr.length > 0) {
    indexes.push({start: curr[0].fromRow, count: curr[0].toRow - curr[0].fromRow});
    curr = sheetsTable[curr[0].toRow];
  }

  return indexes;
}

export function asSingleCell(cell: Cell): SingleCell {
  if (cell.isSingle) {
    return cell;
  }

  throw new Error('Cell is not single');
}

export function asMultiCell(cell: Cell): MultiCell {
  if (!cell.isSingle) {
    return cell;
  }

  throw new Error('Cell is not multi');
}
