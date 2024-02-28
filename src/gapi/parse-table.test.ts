import {assert, objectThat, setup, should, test} from 'gs-testing';
import {booleanType, numberType, stringType} from 'gs-types';

import {Cell, parseTable} from './parse-table';
import {createSheetsTable, Merge} from './sheets-table';
import {CellData, ExtendedValue, RowData} from './type/sheets';

function createMerge(
  row: number,
  rowSpan: number,
  col: number,
  colSpan: number,
): Merge {
  return {
    startRowIndex: row,
    endRowIndex: row + rowSpan - 1,
    startColumnIndex: col,
    endColumnIndex: colSpan - 1,
  };
}

function createCellData(
  value: boolean | number | string | undefined = undefined,
): CellData {
  if (booleanType.check(value)) {
    return {effectiveValue: {boolValue: value}};
  }

  if (numberType.check(value)) {
    return {effectiveValue: {numberValue: value}};
  }

  if (stringType.check(value)) {
    return {effectiveValue: {stringValue: value}};
  }

  return {effectiveValue: {}};
}

function createRowData(cellData: readonly CellData[]): RowData {
  return {values: cellData};
}

function handleCell<T>(
  combineFn: (acc: T, curr: ExtendedValue) => T,
  initCombine: T,
): (cell: Cell) => T {
  return (cell) => {
    let acc = initCombine;
    if (cell.isSingle) {
      return combineFn(acc, cell.value);
    }

    for (const row of cell.value) {
      for (const cell of row) {
        acc = combineFn(acc, cell.value);
      }
    }
    return acc;
  };
}

interface TestData {
  readonly b: boolean;
  readonly n: number;
  readonly s: string;
}

test('@tools/src/gapi/parse-table', () => {
  const _ = setup(() => {
    // .T. -a- --- .0.
    // -F- .b. ... -1-
    // --- ... ... *2*
    // .F. -c- *d* .3.

    const merges = [
      createMerge(0, 1, 1, 2),
      createMerge(1, 2, 0, 1),
      createMerge(1, 2, 1, 2),
    ];

    const rowData = [
      createRowData([
        createCellData(true),
        createCellData('a'),
        createCellData(),
        createCellData(0),
      ]),
      createRowData([
        createCellData(false),
        createCellData('b'),
        createCellData(),
        createCellData(1),
      ]),
      createRowData([
        createCellData(),
        createCellData(),
        createCellData(),
        createCellData(2),
      ]),
      createRowData([
        createCellData(false),
        createCellData('c'),
        createCellData('d'),
        createCellData(3),
      ]),
    ];

    const table = createSheetsTable({data: [{rowData}], merges}, 0, 4, 0, 4);

    return {table};
  });

  should('handle rows with span of 1 correctly', () => {
    const result = parseTable({span: 1, colSpecs: [{index: 1, span: 2}]})
      .handleCell(
        0,
        handleCell((acc, value) => ({b: acc.b || (value.boolValue ?? false)}), {
          b: false,
        }),
      )
      .handleCell(
        1,
        handleCell((acc, value) => ({s: acc.s + (value.stringValue ?? '')}), {
          s: '',
        }),
      )
      .handleCell(
        2,
        handleCell((acc, value) => ({n: acc.n + (value.numberValue ?? 0)}), {
          n: 0,
        }),
      )
      .parse(_.table);

    assert(result).to.haveExactElements([
      objectThat<TestData>().haveProperties({b: true, s: 'a', n: 0}),
      objectThat<TestData>().haveProperties({b: false, s: 'b', n: 1}),
      objectThat<TestData>().haveProperties({b: false, s: '', n: 2}),
      objectThat<TestData>().haveProperties({b: false, s: 'cd', n: 3}),
    ]);
  });

  should('handle rows with > 1 span correctly', () => {
    const result = parseTable({span: 2, colSpecs: [{index: 1, span: 2}]})
      .handleCell(
        0,
        handleCell((acc, value) => ({b: acc.b || (value.boolValue ?? false)}), {
          b: false,
        }),
      )
      .handleCell(
        1,
        handleCell((acc, value) => ({s: acc.s + (value.stringValue ?? '')}), {
          s: '',
        }),
      )
      .handleCell(
        2,
        handleCell((acc, value) => ({n: acc.n + (value.numberValue ?? 0)}), {
          n: 0,
        }),
      )
      .parse(_.table);

    assert(result).to.haveExactElements([
      objectThat<TestData>().haveProperties({b: true, s: 'ab', n: 1}),
      objectThat<TestData>().haveProperties({b: false, s: 'cd', n: 5}),
    ]);
  });
});
