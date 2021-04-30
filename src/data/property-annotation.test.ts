/* eslint-disable @typescript-eslint/ban-types */
import {assert, should, test} from 'gs-testing';

import {asArray} from '../collect/operators/as-array';
import {flat} from '../collect/operators/flat';
import {$map} from '../collect/operators/map';
import {$pipe} from '../collect/operators/pipe';

import {PropertyAnnotator} from './property-annotation';

const annotation = new PropertyAnnotator((_, propertyKey, value: string) => {
  return propertyKey.toString() + value;
});

class ParentClass {
  @annotation.decorator('a')
  @annotation.decorator('b')
  methodA(): void {
    // noop
  }

  @annotation.decorator('c')
  @annotation.decorator('d')
  methodB(): void {
    // noop
  }
}

class ChildClass extends ParentClass { }

class DescendantClass extends ChildClass {
  @annotation.decorator('e')
  @annotation.decorator('f')
  methodA(): void {
    // noop
  }
}

test('data.PropertyAnnotation', () => {
  test('getAttachedValues', () => {
    function getFlatAttachedValues(
        ctorFn: Object,
        key: string|symbol,
    ): Array<Object|string> {
      return $pipe(
          annotation.data.getAttachedValues(ctorFn, key),
          $map(([obj, valuesList]) => [obj, ...valuesList]),
          flat<Object|string>(),
          asArray(),
      );
    }

    should('return the correct values', () => {
      // Check method A
      assert(getFlatAttachedValues(DescendantClass, 'methodA')).to.haveExactElements([
        DescendantClass,
        'methodAf',
        'methodAe',
        ParentClass,
        'methodAb',
        'methodAa',
      ]);
      assert(getFlatAttachedValues(ChildClass, 'methodA')).to.haveExactElements([
        ParentClass,
        'methodAb',
        'methodAa',
      ]);
      assert(getFlatAttachedValues(ParentClass, 'methodA')).to.haveExactElements([
        ParentClass,
        'methodAb',
        'methodAa',
      ]);

      // Check method B
      assert(getFlatAttachedValues(DescendantClass, 'methodB')).to.haveExactElements([
        ParentClass,
        'methodBd',
        'methodBc',
      ]);
      assert(getFlatAttachedValues(ChildClass, 'methodB')).to.haveExactElements([
        ParentClass,
        'methodBd',
        'methodBc',
      ]);
      assert(getFlatAttachedValues(ParentClass, 'methodB')).to.haveExactElements([
        ParentClass,
        'methodBd',
        'methodBc',
      ]);
    });
  });

  test('getAttachedValuesForCtor', () => {
    function getFlatAttachedValues(ctorFn: Object): Array<Object|number> {
      return $pipe(
          annotation.data.getAttachedValuesForCtor(ctorFn),
          $map(([key, indexMap]) => {
            const values = $pipe(
                indexMap,
                $map(([key, values]) => [key, ...values]),
                flat<Object|string>(),
                asArray(),
            );

            return [key, values] as [string|symbol, Array<string|Object>];
          }),
          $map(([key, values]) => [key, ...values]),
          flat(),
          asArray(),
      );
    }

    should('return the correct values', () => {
      assert(getFlatAttachedValues(DescendantClass)).to.haveExactElements([
        'methodA',
        DescendantClass,
        'methodAf',
        'methodAe',
        ParentClass,
        'methodAb',
        'methodAa',
        'methodB',
        ParentClass,
        'methodBd',
        'methodBc',
      ]);
      assert(getFlatAttachedValues(ChildClass)).to.haveExactElements([
        'methodA',
        ParentClass,
        'methodAb',
        'methodAa',
        'methodB',
        ParentClass,
        'methodBd',
        'methodBc',
      ]);
      assert(getFlatAttachedValues(ParentClass)).to.haveExactElements([
        'methodA',
        ParentClass,
        'methodAb',
        'methodAa',
        'methodB',
        ParentClass,
        'methodBd',
        'methodBc',
      ]);
    });
  });
});
