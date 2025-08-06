import {Type, numberType, stringType} from 'gs-types';

import {SheetsCell, SheetsTable} from './sheets-table';
import {ExtendedValue} from './type/sheets';

/**
 * Cell that contains a single cell in the sheet.
 *
 * @remarks
 * If the cell has unmerged row header and column header, the cell will be a single cell.
 *
 * @thModule gapi.sheets
 */
export interface SingleCell {
  /**
   * The cell does not have multiple subcells.
   */
  readonly isSingle: true;

  /**
   * Value inside the cell.
   */
  readonly value: ExtendedValue;
}

/**
 * Cell that contains multiple cells in the sheet.
 *
 * @remarks
 * If the cell has a merged row header, or a merged column header, the cell will be a multicell.
 *
 * @thModule gapi.sheets
 */
export interface MultiCell {
  /**
   * The cell has multiple subcells.
   */
  readonly isSingle: false;

  /**
   * Subtable in the cell.
   */
  readonly value: SheetsTable;
}

/**
 * A cell in the table.
 *
 * @thModule gapi.sheets
 */
export type Cell = MultiCell | SingleCell;

interface ColSpec {
  readonly index: number;
  readonly span: number;
}

interface RowSpecInput {
  readonly colSpecs?: readonly ColSpec[];
  readonly span?: number;
}

interface RowSpec {
  readonly colSpans: readonly number[];
  readonly span: number;
}

type CellHandler<T> = (cell: Cell) => T;

export class ParserBuilder<T> {
  constructor(
    private readonly rowSpec: RowSpec,
    private readonly cellHandlerMap: ReadonlyMap<number, CellHandler<{}>>,
  ) {}

  handleCell<T2 extends {}>(
    index: number,
    fn: CellHandler<T2>,
  ): ParserBuilder<T & T2> {
    return new ParserBuilder<T & T2>(
      this.rowSpec,
      new Map([...this.cellHandlerMap, [index, fn]]),
    );
  }
  handleMultiCell<T2 extends {}>(
    index: number,
    fn: (cell: MultiCell) => T2,
  ): ParserBuilder<T & T2> {
    return this.handleCell(index, (cell) => {
      if (cell.isSingle) {
        throw new Error('Cell is expected to be multi but was not');
      }

      return fn(cell);
    });
  }
  handleSingleCell<T2 extends {}>(
    index: number,
    fn: (cell: SingleCell) => T2,
  ): ParserBuilder<T & T2> {
    return this.handleCell(index, (cell) => {
      if (!cell.isSingle) {
        throw new Error('Cell is expected to be single but was not');
      }

      return fn(cell);
    });
  }
  parse(table: SheetsTable): ReadonlyArray<Partial<T>> {
    const rowSpan = this.rowSpec.span;
    const values: Array<Partial<T>> = [];
    for (let r = 0; r < table.length; r += rowSpan) {
      const cells = table[r];
      let c = 0;
      let mappedC = 0;
      let value = {};
      if (cells === undefined) {
        throw new Error(`Row ${r} cannot be found`);
      }
      while (c < cells.length) {
        const colSpan = this.rowSpec.colSpans[c] ?? 1;

        // Create the cell to be passed to the handler.
        const cell = getCell(table, r, rowSpan, c, colSpan);
        const handler = this.cellHandlerMap.get(mappedC) ?? (() => ({}));
        value = {...value, ...handler(cell)};

        c += colSpan;
        mappedC++;
      }
      values.push(value);
    }

    return values;
  }
}

function getCell(
  table: SheetsTable,
  row: number,
  rowSpan: number,
  col: number,
  colSpan: number,
): Cell {
  const ids = new Set<SheetsCell>();
  const subRows: SheetsCell[][] = [];
  for (let r = row; r < row + rowSpan; r++) {
    const subCols: SheetsCell[] = [];
    for (let c = col; c < col + colSpan; c++) {
      const cells = table[r];
      if (cells === undefined) {
        throw new Error(`Row ${r} cannot be found`);
      }
      const sheetsCell = cells[c];
      if (sheetsCell === undefined) {
        throw new Error(`Row ${r} column ${c} cannot be found`);
      }
      ids.add(sheetsCell);
      subCols.push(sheetsCell);
    }
    subRows.push(subCols);
  }

  // Check if there is only one cell. If there is, only add that one.
  if (ids.size === 1) {
    const cell = subRows[0]?.[0];
    if (cell === undefined) {
      throw new Error('Ids is corrupted. Size is 1 but no subRows found');
    }
    return {isSingle: true, value: cell.value};
  } else {
    return {isSingle: false, value: subRows};
  }
}

export function parseTable(rowSpecInput: RowSpecInput): ParserBuilder<{}> {
  const colSpans = [];
  for (const {index, span} of rowSpecInput.colSpecs ?? []) {
    colSpans[index] = span;
  }
  const rowSpec = {
    colSpans,
    span: rowSpecInput.span ?? 1,
  };

  return new ParserBuilder<{}>(rowSpec, new Map());
}

export function parseNumber(): (cell: SingleCell) => number;
export function parseNumber<T extends number | undefined>(
  type: Type<T>,
): (cell: SingleCell) => T;
export function parseNumber(
  type: Type<number> = numberType,
): (cell: SingleCell) => number {
  return (cell: SingleCell): number => {
    const raw = cell.value.numberValue;
    type.assert(raw);
    return raw;
  };
}

export function parseString(): (cell: SingleCell) => string;
export function parseString<T extends string | undefined>(
  type: Type<T>,
): (cell: SingleCell) => T;
export function parseString(
  type: Type<string> = stringType,
): (cell: SingleCell) => string {
  return (cell: SingleCell): string => {
    const raw = cell.value.stringValue;
    type.assert(raw);
    return raw;
  };
}
