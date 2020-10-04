/**
 * Provides various utilities for development that are too small to be in their own package.
 *
 * @packageDocumentation
 */

// collect
export { $pipe } from '../src/collect/operators/pipe';

export { asArray as $asArray } from '../src/collect/operators/as-array';
export { asOrderedMap as $asOrderedMap } from '../src/collect/operators/as-ordered-map';
export { asMap as $asMap } from '../src/collect/operators/as-map';
export { asRecord as $asRecord } from '../src/collect/operators/as-record';
export { asSet as $asSet } from '../src/collect/operators/as-set';
export { diff as $diff } from '../src/collect/operators/diff';
export { every as $every } from '../src/collect/operators/every';
export { filter as $filter } from '../src/collect/operators/filter';
export { filterByType as $filterByType } from '../src/collect/operators/filter-by-type';
export { filterDefined as $filterDefined } from '../src/collect/operators/filter-defined';
export { filterNonNull as $filterNonNull } from '../src/collect/operators/filter-non-null';
export { first as $first } from '../src/collect/operators/first';
export { flat as $flat } from '../src/collect/operators/flat';
export { intersect as $intersect } from '../src/collect/operators/intersect';
export { join as $join } from '../src/collect/operators/join';
export { map as $map } from '../src/collect/operators/map';
export { max as $max } from '../src/collect/operators/max';
export { min as $min } from '../src/collect/operators/min';
export { recordToMap as $recordToMap } from '../src/collect/operators/record-to-map';
export { reverse as $reverse } from '../src/collect/operators/reverse';
export { size as $size } from '../src/collect/operators/size';
export { some as $some } from '../src/collect/operators/some';
export { sort as $sort } from '../src/collect/operators/sort';
export { take as $take } from '../src/collect/operators/take';
export { zip as $zip } from '../src/collect/operators/zip';

export { arrayFrom } from '../src/collect/structures/array-from';
export { countableIterable } from '../src/collect/structures/countable-iterable';

export { byType } from '../src/collect/compare/by-type';
export { compound } from '../src/collect/compare/compound';
export { following } from '../src/collect/compare/following';
export { isOneOf } from '../src/collect/compare/is-one-of';
export { matches } from '../src/collect/compare/matches';
export { natural } from '../src/collect/compare/natural';
export { normal } from '../src/collect/compare/normal';
export { reversed } from '../src/collect/compare/reversed';
export { withMap } from '../src/collect/compare/with-map';

export { Ordering } from '../src/collect/compare/ordering';
export { OrderedMap } from '../src/collect/structures/ordered-map';
export { ReadonlyOrderedMap } from '../src/collect/structures/readonly-ordered-map';

// color
export { Color } from '../src/color/color';
export { fromCssColor, getContrast, getDistance, mix, neonize } from '../src/color/colors';
export { HslColor } from '../src/color/hsl-color';
export { RgbColor } from '../src/color/rgb-color';

// data
export { ClassAnnotation, ClassAnnotator } from '../src/data/class-annotation';
export { ParameterAnnotation, ParameterAnnotator } from '../src/data/parameter-annotation';
export { PropertyAnnotation, PropertyAnnotator } from '../src/data/property-annotation';
export { cache } from '../src/data/cache';

// gapi
export { ExtendedValue, CellData, GridData, GridRange, RowData } from '../src/gapi/type/sheets';
export { createSheetsTable, Merge, RawSheet, SheetsTable } from '../src/gapi/sheets-table';
export { asSingleCell, asMultiCell, defineTable, Cell, SingleCell, MultiCell } from '../src/gapi/define-table';

// math
export { mod } from '../src/math/mod';

// path
export { AbsolutePath } from '../src/path/absolute-path';
export { absolutePathParser } from '../src/path/absolute-path-parser';
export { Path, SEPARATOR } from '../src/path/path';
export { absolutePath, getDirPath, getFilenameParts, getItemName, getRelativePath, getSubPathsToRoot, join, normalize, relativePath, setFilenameExt } from '../src/path/paths';

// random
export { SequentialIdGenerator } from '../src/random/sequential-id-generator';
export { SimpleIdGenerator } from '../src/random/simple-id-generator';

export { RandomSeed } from '../src/random/seed/random-seed';
export { aleaSeed } from '../src/random/seed/alea-seed';

export { Random, fromSeed } from '../src/random/random';
export { randomInt } from '../src/random/operators/random-int';
export { randomItem } from '../src/random/operators/random-item';
export { randomPickWeighted } from '../src/random/operators/random-pick-weighted';
export { randomPickWeightedMultiple } from '../src/random/operators/random-pick-weighted-multiple';
export { randomShortId } from '../src/random/operators/random-short-id';
export { shuffle } from '../src/random/operators/shuffle';

export { FakeSeed } from '../src/random/testing/fake-seed';

// rxjs
export { assertByType } from '../src/rxjs/assert-by-type';
export { assertDefined } from '../src/rxjs/assert-defined';
export { assertNonNull } from '../src/rxjs/assert-non-null';
export { convertBackward } from '../src/rxjs/convert-backward';
export { convertForward } from '../src/rxjs/convert-forward';
export { debug } from '../src/rxjs/debug';
export { filterByType } from '../src/rxjs/filter-by-type';
export { filterDefined } from '../src/rxjs/filter-defined';
export { filterNonNull } from '../src/rxjs/filter-non-null';
export { mapNonNull } from '../src/rxjs/map-non-null';
export { switchMapNonNull } from '../src/rxjs/switch-map-non-null';
export { usingResource } from '../src/rxjs/using-resource';

export { mapArrayDiff, scanArray, ArrayDiff, diffArray } from '../src/rxjs/state/array-diff';
export { scanMap, MapSet, MapInit, MapDelete, MapDiff, diffMap } from '../src/rxjs/state/map-diff';
export { scanSet, SetAdd, SetInit, SetDelete, SetDiff, diffSet } from '../src/rxjs/state/set-diff';

export { Runnable } from '../src/rxjs/runnable';

// serializer
export { integerConverter } from '../src/serializer/integer-converter';
export { listConverter } from '../src/serializer/list-converter';
export { mapConverter } from '../src/serializer/map-converter';
export { objectConverter } from '../src/serializer/object-converter';
export { setConverter } from '../src/serializer/set-converter';
export { stringMatchConverter } from '../src/serializer/string-match-converter';
export { typeBased } from '../src/serializer/type-based-converter';

// state
export { Snapshot } from '../src/state/snapshot';
export { createId, StateId } from '../src/state/state-id';
export { fakeStateService } from '../src/state/testing/state-service';
export { StateService } from '../src/state/state-service';

// store
export { InMemoryStorage } from '../src/store/in-memory-storage';
export { EditableStorage } from '../src/store/editable-storage';
export { LocalStorage } from '../src/store/local-storage';

// string
export { Cases } from '../src/string/cases';

// typescript
export { assertUnreachable } from '../src/typescript/assert-unreachable';
export { fromLowerCaseString, fromNumberString, getAllValues, toLowerCaseString } from '../src/typescript/enums';
export { asTuple } from '../src/typescript/as-tuple';

// util
export { diff } from '../src/util/diff';

// Type only exports.
export { CompareResult } from '../src/collect/compare/compare-result';
export { FiniteIterable } from '../src/collect/operators/finite-iterable';
export { HasSize } from '../src/collect/operators/size';
export { Operator } from '../src/collect/operators/operator';
export { Library } from '../src/gapi/builder';
export { SheetsCell } from '../src/gapi/sheets-table';
export { AbsolutePathParser } from '../src/path/absolute-path-parser';
export { BaseIdGenerator } from '../src/random/base-id-generator';
