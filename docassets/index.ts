/**
 * Provides various utilities for development that are too small to be in their own package.
 *
 * @packageDocumentation
 */

// collect
export {$pipe} from '../src/typescript/pipe';

export {$asArray} from '../src/collect/operators/as-array';
export {$asOrderedMap} from '../src/collect/operators/as-ordered-map';
export {$asMap} from '../src/collect/operators/as-map';
export {$asRecord} from '../src/collect/operators/as-record';
export {$asSet} from '../src/collect/operators/as-set';
export {$every} from '../src/collect/operators/every';
export {$filter} from '../src/collect/operators/filter';
export {$filterByType} from '../src/collect/operators/filter-by-type';
export {$filterDefined} from '../src/collect/operators/filter-defined';
export {$filterNonNull} from '../src/collect/operators/filter-non-null';
export {$first} from '../src/collect/operators/first';
export {$flat} from '../src/collect/operators/flat';
export {$intersect} from '../src/collect/operators/intersect';
export {$join} from '../src/collect/operators/join';
export {$map} from '../src/collect/operators/map';
export {$max} from '../src/collect/operators/max';
export {$min} from '../src/collect/operators/min';
export {$recordToMap} from '../src/collect/operators/record-to-map';
export {$reverse} from '../src/collect/operators/reverse';
export {$size} from '../src/collect/operators/size';
export {$some} from '../src/collect/operators/some';
export {$sort} from '../src/collect/operators/sort';
export {$take} from '../src/collect/operators/take';
export {$zip} from '../src/collect/operators/zip';

export {arrayFrom} from '../src/collect/structures/array-from';
export {countableIterable} from '../src/collect/structures/countable-iterable';

export {byType} from '../src/collect/compare/by-type';
export {compound} from '../src/collect/compare/compound';
export {following} from '../src/collect/compare/following';
export {isOneOf} from '../src/collect/compare/is-one-of';
export {matches} from '../src/collect/compare/matches';
export {natural} from '../src/collect/compare/natural';
export {normal} from '../src/collect/compare/normal';
export {reversed} from '../src/collect/compare/reversed';
export {withMap} from '../src/collect/compare/with-map';

export {Ordering} from '../src/collect/compare/ordering';
export {OrderedMap} from '../src/collect/structures/ordered-map';
export {ReadonlyOrderedMap} from '../src/collect/structures/readonly-ordered-map';

// color
export {Color} from '../src/color/color';
export {
  fromCssColor,
  getContrast,
  getDistance,
  mix,
  neonize,
} from '../src/color/colors';
export {HslColor} from '../src/color/hsl-color';
export {RgbColor} from '../src/color/rgb-color';

// data
export {CachedValue} from '../src/data/cached-value';

// gapi
export {
  ExtendedValue,
  CellData,
  GridData,
  GridRange,
  RowData,
} from '../src/gapi/type/sheets';
export {
  createSheetsTable,
  Merge,
  RawSheet,
  SheetsTable,
} from '../src/gapi/sheets-table';

// math
export {mod} from '../src/math/mod';

// path
export {AbsolutePath} from '../src/path/absolute-path';
export {absolutePathParser} from '../src/path/absolute-path-parser';
export {Path, SEPARATOR} from '../src/path/path';
export {
  absolutePath,
  getDirPath,
  getFilenameParts,
  getItemName,
  getRelativePath,
  getSubPathsToRoot,
  join,
  normalize,
  relativePath,
  setFilenameExt,
} from '../src/path/paths';

// rxjs
export {assertByType} from '../src/rxjs/assert-by-type';
export {assertDefined} from '../src/rxjs/assert-defined';
export {assertNonNull} from '../src/rxjs/assert-non-null';
export {convertBackward} from '../src/rxjs/convert-backward';
export {convertForward} from '../src/rxjs/convert-forward';
export {debug} from '../src/rxjs/debug';
export {filterByType} from '../src/rxjs/filter-by-type';
export {usingResource} from '../src/rxjs/using-resource';

export {ArrayDiff, diffArray} from '../src/collect/diff/diff-array';
export {MapDiff, diffMap} from '../src/collect/diff/diff-map';
export {SetDiff, diffSet} from '../src/collect/diff/diff-set';

export {Runnable} from '../src/rxjs/runnable';

// serializer
export {integerConverter} from '../src/serializer/integer-converter';
export {listConverter} from '../src/serializer/list-converter';
export {mapConverter} from '../src/serializer/map-converter';
export {objectConverter} from '../src/serializer/object-converter';
export {setConverter} from '../src/serializer/set-converter';
export {stringMatchConverter} from '../src/serializer/string-match-converter';
export {typeBased} from '../src/serializer/type-based-converter';

// store
export {InMemoryStorage} from '../src/store/in-memory-storage';
export {EditableStorage} from '../src/store/editable-storage';
export {LocalStorage} from '../src/store/local-storage';

// string
export {convertCaseFrom, convertCaseAtomFrom} from '../src/string/cases';

// typescript
export {assertUnreachable} from '../src/typescript/assert-unreachable';
export {
  fromLowerCaseString,
  fromNumberString,
  getAllValues,
  toLowerCaseString,
} from '../src/typescript/enums';
export {asTuple} from '../src/typescript/as-tuple';
export {getOwnPropertyKeys} from '../src/typescript/get-own-property-keys';

// util
export {diff} from '../src/util/diff';

// Type only exports.
export {CompareResult} from '../src/collect/compare/compare-result';
export {FiniteIterable} from '../src/collect/operators/finite-iterable';
export {HasSize} from '../src/collect/operators/size';
export {Library} from '../src/gapi/builder';
export {SheetsCell} from '../src/gapi/sheets-table';
export {AbsolutePathParser} from '../src/path/absolute-path-parser';
