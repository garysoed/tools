// tslint:disable:no-non-null-assertion
import { assert, match, setup, should, test } from 'gs-testing/export/main';
import { flat } from '../collect/operators/flat';
import { map } from '../collect/operators/map';
import { mapPick } from '../collect/operators/map-pick';
import { pipe } from '../collect/pipe';
import { ParameterAnnotator } from './parameter-annotation';

const annotation = new ParameterAnnotator((_, propertyKey, index, pad) => {
  return `${propertyKey.toString()}_${index + pad}`;
});

class ParentClass {
  methodA(
      @annotation.decorator(1)
      @annotation.decorator(2)
      _param0: {},
      @annotation.decorator(3)
      _param1: {},
  ): void {
    // noop
  }

  methodB(
      @annotation.decorator(4) _param0: {},
  ): void {
    // noop
  }
}

class ChildClass extends ParentClass { }

class DescendantClass extends ChildClass {
  methodA(
      @annotation.decorator(5)
      _param0: {},
      @annotation.decorator(6)
      @annotation.decorator(7)
      _param1: {},
  ): void {
    // noop
  }
}

test('data.ParameterAnnotator', () => {
  test('getAttachedValues', () => {
    function getFlatAttachedValues(
        ctorFn: Object,
        key: string|symbol,
        index: number,
    ): Array<Object|string> {
      return [
        ...pipe(
            annotation.data.getAttachedValues(ctorFn, key, index),
            map(([obj, valuesList]) => [obj, ...valuesList]),
            flat<Object|string>(),
        )(),
      ];
    }

    should(`return the correct values`, () => {
      // Check method A, param 0.
      assert(getFlatAttachedValues(DescendantClass, 'methodA', 0)).to.haveExactElements([
        DescendantClass,
        'methodA_5',
        ParentClass,
        'methodA_2',
        'methodA_1',
      ]);
      assert(getFlatAttachedValues(ChildClass, 'methodA', 0)).to.haveExactElements([
        ParentClass,
        'methodA_2',
        'methodA_1',
      ]);
      assert(getFlatAttachedValues(ParentClass, 'methodA', 0)).to.haveExactElements([
        ParentClass,
        'methodA_2',
        'methodA_1',
      ]);

      // Check method A, param 1.
      assert(getFlatAttachedValues(DescendantClass, 'methodA', 1)).to.haveExactElements([
        DescendantClass,
        'methodA_8',
        'methodA_7',
        ParentClass,
        'methodA_4',
      ]);
      assert(getFlatAttachedValues(ChildClass, 'methodA', 1)).to.haveExactElements([
        ParentClass,
        'methodA_4',
      ]);
      assert(getFlatAttachedValues(ParentClass, 'methodA', 1)).to.haveExactElements([
        ParentClass,
        'methodA_4',
      ]);

      // Check method B
      assert(getFlatAttachedValues(DescendantClass, 'methodB', 0)).to.haveExactElements([
        DescendantClass,
        ParentClass,
        'methodB_4',
      ]);
      assert(getFlatAttachedValues(ChildClass, 'methodB', 0)).to.haveExactElements([
        ParentClass,
        'methodB_4',
      ]);
      assert(getFlatAttachedValues(ParentClass, 'methodB', 0)).to.haveExactElements([
        ParentClass,
        'methodB_4',
      ]);
    });
  });

  test('getAttachedValuesForCtor', () => {
    function getFlatAttachedValues(ctorFn: Object): Array<Object|string|symbol|number> {
      return [
        ...pipe(
            annotation.data.getAttachedValuesForCtor(ctorFn),
            mapPick(
                1,
                indexMap => pipe(
                    indexMap,
                    mapPick(
                        1,
                        objMap => pipe(
                            objMap,
                            map(([obj, valuesList]) => [obj, ...valuesList]),
                            flat(),
                        ),
                    ),
                    map(([key, values]) => [key, ...values()]),
                    flat<Object|string|symbol|number>(),
                ),
            ),
            map(([key, values]) => [key, ...values()]),
            flat<Object|string|symbol|number>(),
        )(),
      ];
    }

    should(`return the correct values`, () => {
      // Check method A, param 0.
      assert(getFlatAttachedValues(DescendantClass)).to.haveExactElements([
        'methodA',
        1,
        DescendantClass,
        'methodA_8',
        'methodA_7',
        ParentClass,
        'methodA_4',
        0,
        DescendantClass,
        'methodA_5',
        ParentClass,
        'methodA_2',
        'methodA_1',
        'methodB',
        0,
        DescendantClass,
        ParentClass,
        'methodB_4',
      ]);
      assert(getFlatAttachedValues(ChildClass)).to.haveExactElements([
        'methodA',
        1,
        ParentClass,
        'methodA_4',
        0,
        ParentClass,
        'methodA_2',
        'methodA_1',
        'methodB',
        0,
        ParentClass,
        'methodB_4',
      ]);
      assert(getFlatAttachedValues(ParentClass)).to.haveExactElements([
        'methodA',
        1,
        ParentClass,
        'methodA_4',
        0,
        ParentClass,
        'methodA_2',
        'methodA_1',
        'methodB',
        0,
        ParentClass,
        'methodB_4',
      ]);
    });
  });

  test('getAttachedValuesForKey', () => {
    function getFlatAttachedValues(ctorFn: Object, key: string|symbol): Array<Object|number> {
      return [
        ...pipe(
            annotation.data.getAttachedValuesForKey(ctorFn, key),
            mapPick(
                1,
                indexMap => pipe(
                    indexMap,
                    map(([key, values]) => [key, ...values()]),
                    flat<Object|string|symbol|number>(),
                ),
            ),
            map(([key, values]) => [key, ...values()]),
            flat<Object|string|symbol|number>(),
        )(),
      ];
    }

    should(`return the correct values`, () => {
      // Check method A.
      assert(getFlatAttachedValues(DescendantClass, 'methodA')).to.haveExactElements([
        1,
        DescendantClass,
        'methodA_8',
        'methodA_7',
        ParentClass,
        'methodA_4',
        0,
        DescendantClass,
        'methodA_5',
        ParentClass,
        'methodA_2',
        'methodA_1',
      ]);
      assert(getFlatAttachedValues(ChildClass, 'methodA')).to.haveExactElements([
        1,
        ParentClass,
        'methodA_4',
        0,
        ParentClass,
        'methodA_2',
        'methodA_1',
      ]);
      assert(getFlatAttachedValues(ParentClass, 'methodA')).to.haveExactElements([
        1,
        ParentClass,
        'methodA_4',
        0,
        ParentClass,
        'methodA_2',
        'methodA_1',
      ]);

      // Check method B
      assert(getFlatAttachedValues(DescendantClass, 'methodB')).to.haveExactElements([
        0,
        DescendantClass,
        ParentClass,
        'methodB_4',
      ]);
      assert(getFlatAttachedValues(ChildClass, 'methodB')).to.haveExactElements([
        0,
        ParentClass,
        'methodB_4',
      ]);
      assert(getFlatAttachedValues(ParentClass, 'methodB')).to.haveExactElements([
        0,
        ParentClass,
        'methodB_4',
      ]);
    });
  });
});
