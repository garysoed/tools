export interface ExtendedValue {
  readonly numberValue?: number;
  readonly stringValue?: string;
}

export interface CellData {
  readonly effectiveValue?: ExtendedValue;
  readonly userEnteredFormat?: unknown;
}

export interface RowData {
  readonly values?: readonly CellData[];
}

export interface GridData {
  readonly rowData?: readonly RowData[];
}
