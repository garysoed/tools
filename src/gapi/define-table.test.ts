import {MatcherType, arrayThat, assert, objectThat, should, test} from 'gs-testing';

import {Cell, MultiCell, SingleCell, defineTable} from './define-table';
import {Merge, SheetsCell, SheetsTable, createSheetsTable} from './sheets-table';
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

function multiCellMatcher(value: SheetsTable): MatcherType<MultiCell> {
  return objectThat<MultiCell>().haveProperties({
    isSingle: false,
    value: arrayThat<ReadonlyArray<SheetsCell>>().haveExactElements(value.map(row => {
      return arrayThat<SheetsCell>().haveExactElements(row.map(cell => {
        return objectThat<SheetsCell>().haveProperties(cell);
      }));
    })),
  });
}

function singleCellMatcher(value: string): MatcherType<SingleCell> {
  return objectThat<SingleCell>().haveProperties({
    isSingle: true,
    value: objectThat<ExtendedValue>().haveProperties({
      stringValue: value,
    }),
  });
}

test('@tools/gapi/define-table', init => {
  const _ = init(() => {
    // Table:
    // 0_0 1_0 2_0 --- ---
    // 0_1 1_1 --- --- ---
    // 0_2 ... ... 3_2 4_2
    // ... ... ... 3_3 4_3
    // 0_4 1_4 2_4 --- 4_4
    // 0_5 1_5 2_5 --- 4_5

    const merges = [
      createMerge(0, 2, 2, 5),
      createMerge(2, 4, 0, 3),
      createMerge(3, 6, 3, 4),
    ];

    const rows: RowData[] = [];
    for (let r = 0; r < 6; r++) {
      const cells: CellData[] = [];
      for (let c = 0; c < 5; c++) {
        cells.push(createCellData(`${c}_${r}`));
      }
      rows.push({values: cells});
    }

    return {sheetsTable: createSheetsTable({data: [{rowData: rows}], merges}, 0, 6, 0, 5)};
  });

  should('return the correct table', () => {
    const {cols, rows, data} = defineTable(_.sheetsTable);

    assert(data).to.equal(arrayThat<readonly Cell[]>().haveExactElements([
      arrayThat<Cell>().haveExactElements([
        singleCellMatcher('1_1'),
        singleCellMatcher('2_0'),
      ]),
      arrayThat<Cell>().haveExactElements([
        singleCellMatcher('0_2'),
        multiCellMatcher([
          [_.sheetsTable[2][2], _.sheetsTable[2][3], _.sheetsTable[2][4]],
          [_.sheetsTable[3][2], _.sheetsTable[3][3], _.sheetsTable[3][4]],
        ]),
      ]),
      arrayThat<Cell>().haveExactElements([
        singleCellMatcher('1_4'),
        multiCellMatcher([[_.sheetsTable[4][2], _.sheetsTable[4][3], _.sheetsTable[4][4]]]),
      ]),
      arrayThat<Cell>().haveExactElements([
        singleCellMatcher('1_5'),
        multiCellMatcher([[_.sheetsTable[5][2], _.sheetsTable[5][3], _.sheetsTable[5][4]]]),
      ]),
    ]));

    assert(rows).to.equal(arrayThat<Cell>().haveExactElements([
      singleCellMatcher('0_1'),
      singleCellMatcher('0_2'),
      singleCellMatcher('0_4'),
      singleCellMatcher('0_5'),
    ]));
    assert(cols).to.equal(arrayThat<Cell>().haveExactElements([
      singleCellMatcher('1_0'),
      singleCellMatcher('2_0'),
    ]));
  });
});
