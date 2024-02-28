import {
  MatcherType,
  arrayThat,
  assert,
  objectThat,
  should,
  test,
} from 'gs-testing';

import {Merge, SheetsCell, createSheetsTable} from './sheets-table';
import {CellData, ExtendedValue, RowData} from './type/sheets';

function createMerge(
  startRow: number,
  endRow: number,
  startColumn: number,
  endColumn: number,
): Merge {
  return {
    startRowIndex: startRow,
    endRowIndex: endRow,
    startColumnIndex: startColumn,
    endColumnIndex: endColumn,
  };
}

function createCellData(value: string): CellData {
  return {effectiveValue: {stringValue: value}};
}

function matchCell(
  fromRow: number,
  toRow: number,
  fromColumn: number,
  toColumn: number,
  value: string,
): MatcherType<SheetsCell> {
  return objectThat<SheetsCell>().haveProperties({
    fromRow,
    toRow,
    fromColumn,
    toColumn,
    value: objectThat<ExtendedValue>().haveProperties({stringValue: value}),
  });
}

test('@tools/gapi/sheets-table', () => {
  test('createSheetsTable', () => {
    should('return the correct table', () => {
      // Table:
      // 0_0 1_0 2_0 --- ---
      // 0_1 1_1 --- --- ---
      // 0_2 ... ... 3_2 4_2
      // ... ... ... 3_3 4_3
      // 0_4 1_4 2_4 --- 4_4
      // 0_5 1_5 nil --- 4_5

      const merges = [
        createMerge(0, 2, 2, 5),
        createMerge(2, 4, 0, 3),
        createMerge(3, 6, 3, 4),
      ];

      const blankCells = new Set([
        '3_0',
        '4_0',
        '2_1',
        '3_1',
        '4_1',
        '1_2',
        '2_2',
        '0_3',
        '1_3',
        '2_3',
        '3_4',
        '2_5',
        '3_5',
      ]);

      const rows: RowData[] = [];
      for (let r = 0; r < 6; r++) {
        const cells: CellData[] = [];
        for (let c = 0; c < 5; c++) {
          const value = `${c}_${r}`;
          if (blankCells.has(value)) {
            continue;
          }
          cells[c] = createCellData(value);
        }
        rows.push({values: cells});
      }

      const table = createSheetsTable(
        {merges, data: [{rowData: rows}]},
        1,
        5,
        1,
        4,
      );
      assert(table).to.equal(
        arrayThat<readonly SheetsCell[]>().haveExactElements([
          arrayThat<SheetsCell>().haveExactElements([
            matchCell(0, 1, 0, 1, '1_1'),
            matchCell(0, 1, 1, 3, '2_0'),
            matchCell(0, 1, 1, 3, '2_0'),
          ]),
          arrayThat<SheetsCell>().haveExactElements([
            matchCell(1, 3, 0, 2, '0_2'),
            matchCell(1, 3, 0, 2, '0_2'),
            matchCell(1, 2, 2, 3, '3_2'),
          ]),
          arrayThat<SheetsCell>().haveExactElements([
            matchCell(1, 3, 0, 2, '0_2'),
            matchCell(1, 3, 0, 2, '0_2'),
            matchCell(2, 4, 2, 3, '3_3'),
          ]),
          arrayThat<SheetsCell>().haveExactElements([
            matchCell(3, 4, 0, 1, '1_4'),
            matchCell(3, 4, 1, 2, '2_4'),
            matchCell(2, 4, 2, 3, '3_3'),
          ]),
        ]),
      );

      // Check that the merge cells are all equal.
      const merge0_2 = table[1][0];
      assert(table[1][1]).to.equal(merge0_2);
      assert(table[2][0]).to.equal(merge0_2);
      assert(table[2][1]).to.equal(merge0_2);

      const merge2_0 = table[0][1];
      assert(table[0][2]).to.equal(merge2_0);

      const merge3_3 = table[2][2];
      assert(table[3][2]).to.equal(merge3_3);
    });
  });
});
