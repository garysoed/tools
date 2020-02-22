import { arrayThat, assert, should, test } from 'gs-testing';

import { getCellContent, getCellContentByRange } from './sheets';
import { CellData, ExtendedValue, GridData } from './type/sheets';

function createCell(stringValue: string): CellData {
  return {effectiveValue: {stringValue}};
}

function getStringValues(
    values: ReadonlyArray<readonly ExtendedValue[]>,
): ReadonlyArray<readonly string[]> {
  return values.map(row => row.map(value => value.stringValue!));
}

test('@tools/gapi/sheets', () => {
  test('getCellContentsByRange', () => {
    should(`return the contents in the specified range`, () => {
      const data: GridData = {
        rowData: [
          {values: [createCell('0,0'), createCell('0,1'), createCell('0,2'), createCell('0,3')]},
          {values: [createCell('1,0'), createCell('1,1'), createCell('1,2'), createCell('1,3')]},
          {values: [createCell('2,0'), createCell('2,1'), createCell('2,2'), createCell('2,3')]},
          {values: [createCell('3,0'), createCell('3,1'), createCell('3,2'), createCell('3,3')]},
        ],
      };

      const contents = getStringValues(getCellContentByRange(
          {row: 1, column: 1},
          {row: 4, column: 3},
          data,
      ));

      assert(contents).to.equal(
          arrayThat<string[]>().haveExactElements([
            arrayThat<string>().haveExactElements(['1,1', '1,2']),
            arrayThat<string>().haveExactElements(['2,1', '2,2']),
            arrayThat<string>().haveExactElements(['3,1', '3,2']),
          ]),
      );
    });

    should(`not return rows without values`, () => {
      const data: GridData = {
        rowData: [
          {values: [createCell('0,0'), createCell('0,1'), createCell('0,2'), createCell('0,3')]},
          {values: [createCell('1,0'), createCell('1,1'), createCell('1,2'), createCell('1,3')]},
          {},
          {values: [createCell('3,0'), createCell('3,1'), createCell('3,2'), createCell('3,3')]},
        ],
      };

      const contents = getStringValues(getCellContentByRange(
          {row: 1, column: 1},
          {row: 4, column: 3},
          data,
      ));

      assert(contents).to.equal(
          arrayThat<string[]>().haveExactElements([
            arrayThat<string>().haveExactElements(['1,1', '1,2']),
            arrayThat<string>().beEmpty(),
            arrayThat<string>().haveExactElements(['3,1', '3,2']),
          ]),
      );
    });

    should(`return empty string if there are no row data`, () => {
      const contents = getCellContentByRange(
          {row: 1, column: 1},
          {row: 3, column: 3},
          {},
      );

      assert(contents).to.equal(arrayThat<ExtendedValue[]>().beEmpty());
    });
  });

  test('getCellContent', () => {
    should(`return the selected content`, () => {
      const data: GridData = {
        rowData: [
          {values: [createCell('0,0'), createCell('0,1'), createCell('0,2'), createCell('0,3')]},
          {values: [createCell('1,0'), createCell('1,1'), createCell('1,2'), createCell('1,3')]},
          {values: [createCell('2,0'), createCell('2,1'), createCell('2,2'), createCell('2,3')]},
          {values: [createCell('3,0'), createCell('3,1'), createCell('3,2'), createCell('3,3')]},
        ],
      };

      assert(getCellContent({row: 1, column: 3}, data)!.stringValue).to.equal('1,3');
    });

    should(`return null if the cell does not exist`, () => {
      assert(getCellContent({row: 1, column: 3}, {rowData: []})).to.beNull();
    });
  });
});
