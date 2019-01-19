// tslint:disable:no-non-null-assertion
import { assert, match, setup, should, test } from 'gs-testing/export/main';
import { exec } from '../collect/exec';
import { getKey } from '../collect/operators/get-key';
import { head } from '../collect/operators/head';
import { pick } from '../collect/operators/pick';
import { size } from '../collect/operators/size';
import { ImmutableList } from '../collect/types/immutable-list';
import { ClassAnnotation } from './class-annotation';

test('data.ClassAnnotation', () => {
  let annotation: ClassAnnotation<number, [number, number]>;

  setup(() => {
    annotation = new ClassAnnotation((_, a, b) => ({
      data: a + b,
      newTarget: undefined,
    }));
  });

  test('getAttachedValues', () => {
    should(`return the correct values`, () => {
      @annotation.getDecorator()(1, 2)
      @annotation.getDecorator()(3, 4)
      class ParentClass { }

      class ChildClass extends ParentClass { }

      @annotation.getDecorator()(5, 6)
      @annotation.getDecorator()(7, 8)
      class DescendantClass extends ChildClass { }

      const descendantAttachedValues = annotation.getAttachedValues(DescendantClass);
      assert(exec(descendantAttachedValues, size())).to.equal(2);

      assert([
        ...exec(
            descendantAttachedValues,
            getKey(DescendantClass as Function),
            pick(1),
            head(),
        )!,
      ]).to.haveExactElements([15, 11]);
      assert([
        ...exec(
            descendantAttachedValues,
            getKey(ParentClass as Function),
            pick(1),
            head(),
        )!,
      ]).to.haveExactElements([7, 3]);

      const childAttachedValues = annotation.getAttachedValues(ChildClass);
      assert(exec(childAttachedValues, size())).to.equal(1);

      assert([
        ...exec(
            childAttachedValues,
            getKey(ParentClass as Function),
            pick(1),
            head(),
        )!,
      ]).to.haveExactElements([7, 3]);

      const parentAttachedValues = annotation.getAttachedValues(ParentClass);
      assert(exec(parentAttachedValues, size())).to.equal(1);

      assert([
        ...exec(
            parentAttachedValues,
            getKey(ParentClass as Function),
            pick(1),
            head(),
        )!,
      ]).to.haveExactElements([7, 3]);
    });
  });
});
