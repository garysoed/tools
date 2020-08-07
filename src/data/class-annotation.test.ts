import { assert, should, test } from 'gs-testing';

import { asArray } from '../collect/operators/as-array';
import { $pipe } from '../collect/operators/pipe';
import { flat } from '../collect/operators/flat';
import { map } from '../collect/operators/map';

import { ClassAnnotator } from './class-annotation';


const annotation = new ClassAnnotator((_, a: number, b: number) => ({
  data: a + b,
  newTarget: undefined,
}));

@annotation.decorator(1, 2)
@annotation.decorator(3, 4)
class ParentClass { }

class ChildClass extends ParentClass { }

@annotation.decorator(5, 6)
@annotation.decorator(7, 8)
class DescendantClass extends ChildClass { }

test('data.ClassAnnotator', () => {
  test('getAttachedValues', () => {
    function getFlatAttachedValues(ctorFn: Function): Array<Object|string> {
      return $pipe(
          annotation.data.getAttachedValues(ctorFn),
          map(([obj, valuesList]) => [obj, ...valuesList]),
          flat<Object|string>(),
          asArray(),
      );
    }

    should(`return the correct values`, () => {
      assert(getFlatAttachedValues(DescendantClass)).to.haveExactElements([
        DescendantClass,
        15,
        11,
        ParentClass,
        7,
        3,
      ]);
      assert(getFlatAttachedValues(ChildClass)).to.haveExactElements([
        ParentClass,
        7,
        3,
      ]);
      assert(getFlatAttachedValues(ParentClass)).to.haveExactElements([
        ParentClass,
        7,
        3,
      ]);
    });
  });
});
