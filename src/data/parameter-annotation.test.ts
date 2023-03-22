/* eslint-disable @typescript-eslint/ban-types */
import {assert, should, test} from 'gs-testing';

import {ParameterAnnotator} from './parameter-annotation';


const annotation = new ParameterAnnotator((_, propertyKey, index, pad: number) => {
  return `${propertyKey.toString()}_${index + pad}`;
});

class ParentClass {
  methodA(
      @annotation.decorator(1)
      @annotation.decorator(2)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _param0: Object,
      @annotation.decorator(3)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _param1: Object,
  ): void {
    // noop
  }

  methodB(
      @annotation.decorator(4)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _param0: {},
  ): void {
    // noop
  }
}

class ChildClass extends ParentClass { }

class DescendantClass extends ChildClass {
  override methodA(
      @annotation.decorator(5)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _param0: Object,
      @annotation.decorator(6)
      @annotation.decorator(7)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _param1: Object,
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
      const values: Array<Object|string|symbol|number> = [];
      for (const [clazz, attachedValues] of annotation.data.getAttachedValues(ctorFn, key, index)) {
        values.push(clazz);
        values.push(...attachedValues);
      }

      return values;
    }

    should('return the correct values', () => {
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
      const values: Array<Object|string|symbol|number> = [];
      for (const [propertyKey, paramMap] of annotation.data.getAttachedValuesForCtor(ctorFn)) {
        values.push(propertyKey);
        for (const [index, inheritanceMap] of paramMap) {
          values.push(index);
          for (const [clazz, attachedValues] of inheritanceMap) {
            values.push(clazz);
            values.push(...attachedValues);
          }
        }
      }

      return values;
    }

    should('return the correct values', () => {
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
      const values: Array<Object|number> = [];
      for (const [index, inheritanceMap] of annotation.data.getAttachedValuesForKey(ctorFn, key)) {
        values.push(index);
        for (const [clazz, attachedValues] of inheritanceMap) {
          values.push(clazz);
          values.push(...attachedValues);
        }
      }

      return values;
    }

    should('return the correct values', () => {
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
