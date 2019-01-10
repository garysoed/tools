import { assert, match, setup, should, test } from 'gs-testing/export/main';
import { ImmutableList } from '../immutable/immutable-list';
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

      assert(annotation.getAttachedValues(DescendantClass)).to.haveElements([
        match.anyTupleThat<[Function, ImmutableList<number>]>().haveExactElements([
            DescendantClass,
            match.anyIterableThat<number, ImmutableList<number>>().haveElements([15, 11]),
        ]),
        match.anyTupleThat<[Function, ImmutableList<number>]>().haveExactElements([
            ParentClass,
            match.anyIterableThat<number, ImmutableList<number>>().haveElements([7, 3]),
        ]),
      ]);

      assert(annotation.getAttachedValues(ChildClass)).to.haveElements([
        match.anyTupleThat<[Function, ImmutableList<number>]>().haveExactElements([
            ParentClass,
            match.anyIterableThat<number, ImmutableList<number>>().haveElements([7, 3]),
        ]),
      ]);

      assert(annotation.getAttachedValues(ParentClass)).to.haveElements([
        match.anyTupleThat<[Function, ImmutableList<number>]>().haveExactElements([
            ParentClass,
            match.anyIterableThat<number, ImmutableList<number>>().haveElements([7, 3]),
        ]),
      ]);
    });
  });
});
