export interface ExtendedValue {
  readonly boolValue?: boolean;
  readonly numberValue?: number;
  readonly stringValue?: string;
}

export interface CellData {
  readonly effectiveValue?: ExtendedValue;
  readonly userEnteredFormat?: unknown;
}

export interface GridData {
  readonly rowData?: readonly RowData[];
}

export interface GridRange {
  readonly endColumnIndex: number;
  readonly endRowIndex: number;
  readonly startColumnIndex: number;
  readonly startRowIndex: number;
}

export interface RowData {
  readonly values?: readonly CellData[];
}
