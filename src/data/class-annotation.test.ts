import { assert, match, setup, should, test } from 'gs-testing/export/main';
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
      class ParentClass { }
      class ChildClass extends ParentClass { }
      class DescendantClass extends ChildClass { }

      annotation.getDecorator()(1, 2)(ParentClass);
      annotation.getDecorator()(3, 4)(DescendantClass);

      assert(annotation.getAttachedValues(DescendantClass)).to.haveElements([
        match.anyTupleThat<[Function, number]>().haveExactElements([DescendantClass, 7]),
        match.anyTupleThat<[Function, number]>().haveExactElements([ParentClass, 3]),
      ]);

      assert(annotation.getAttachedValues(ChildClass)).to.haveElements([
        match.anyTupleThat<[Function, number]>().haveExactElements([ParentClass, 3]),
      ]);

      assert(annotation.getAttachedValues(ParentClass)).to.haveElements([
        match.anyTupleThat<[Function, number]>().haveExactElements([ParentClass, 3]),
      ]);
    });
  });
});
