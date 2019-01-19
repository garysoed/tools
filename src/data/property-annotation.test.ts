// tslint:disable:no-non-null-assertion
import { assert, match, setup, should, test } from 'gs-testing/export/main';
import { exec } from '../collect/exec';
import { getKey } from '../collect/operators/get-key';
import { head } from '../collect/operators/head';
import { pick } from '../collect/operators/pick';
import { size } from '../collect/operators/size';
import { ImmutableList } from '../collect/types/immutable-list';
import { PropertyAnnotation } from './property-annotation';

type Tuple = [Object, ImmutableList<string>];

test('data.PropertyAnnotation', () => {
  let annotation: PropertyAnnotation<string, [string]>;

  setup(() => {
    annotation = new PropertyAnnotation((_, propertyKey, value) => {
      return propertyKey.toString() + value;
    });
  });

  test('getAttachedValues', () => {
    should(`return the correct values`, () => {
      class ParentClass {
        @annotation.getDecorator()('a')
        @annotation.getDecorator()('b')
        methodA(): void {
          // noop
        }

        @annotation.getDecorator()('c')
        @annotation.getDecorator()('d')
        methodB(): void {
          // noop
        }
      }

      class ChildClass extends ParentClass { }

      class DescendantClass extends ChildClass {
        @annotation.getDecorator()('e')
        @annotation.getDecorator()('f')
        methodA(): void {
          // noop
        }
      }

      const descendantAttachedValues = annotation.getAttachedValues(DescendantClass, 'methodA');
      assert(exec(descendantAttachedValues, size())).to.equal(2);

      assert([
        ...exec(
            descendantAttachedValues,
            getKey(DescendantClass as Object),
            pick(1),
            head(),
        )!]).to.haveExactElements(['methodAf', 'methodAe']);
      assert([
        ...exec(
            descendantAttachedValues,
            getKey(ParentClass as Object),
            pick(1),
            head(),
        )!]).to.haveExactElements(['methodAb', 'methodAa']);

      const childAttachedValues = annotation.getAttachedValues(ChildClass, 'methodA');
      assert(exec(childAttachedValues, size())).to.equal(1);

      assert([
        ...exec(
            childAttachedValues,
            getKey(ParentClass as Object),
            pick(1),
            head(),
        )!]).to.haveExactElements(['methodAb', 'methodAa']);

      const parentAttachedValues = annotation.getAttachedValues(ChildClass, 'methodA');
      assert(exec(parentAttachedValues, size())).to.equal(1);

      assert([
        ...exec(
            parentAttachedValues,
            getKey(ParentClass as Object),
            pick(1),
            head(),
        )!]).to.haveExactElements(['methodAb', 'methodAa']);
    });
  });

  test('getAttachedValuesForCtor', () => {
    should(`return the correct values`, () => {
      class ParentClass {
        @annotation.getDecorator()('a')
        @annotation.getDecorator()('b')
        methodA(): void {
          // noop
        }

        @annotation.getDecorator()('c')
        @annotation.getDecorator()('d')
        methodB(): void {
          // noop
        }
      }

      class ChildClass extends ParentClass { }

      class DescendantClass extends ChildClass {
        @annotation.getDecorator()('e')
        @annotation.getDecorator()('f')
        methodA(): void {
          // noop
        }
      }

      const descendantAttachedValues = annotation.getAttachedValuesForCtor(DescendantClass);
      assert(exec(descendantAttachedValues, size())).to.equal(2);

      const descendantMethodAValues = exec(
          descendantAttachedValues,
          getKey('methodA' as string|symbol),
          pick(1),
          head(),
      )!;
      assert(exec(descendantMethodAValues, size())).to.equal(2);
      assert([
        ...exec(
            descendantMethodAValues,
            getKey(DescendantClass as Object),
            pick(1),
            head(),
        )!]).to.haveExactElements(['methodAf', 'methodAe']);
      assert([
        ...exec(
            descendantMethodAValues,
            getKey(ParentClass as Object),
            pick(1),
            head(),
        )!]).to.haveExactElements(['methodAb', 'methodAa']);

      const descendantMethodBValues = exec(
          descendantAttachedValues,
          getKey('methodB' as string|symbol),
          pick(1),
          head(),
      )!;
      assert(exec(descendantMethodBValues, size())).to.equal(1);
      assert([...exec(descendantMethodAValues, getKey(ParentClass as Object), pick(1), head())!]).to
          .haveExactElements([
            'methodBd',
            'methodBc',
          ]);

      const childAttachedValues = annotation.getAttachedValuesForCtor(ChildClass);
      assert(exec(childAttachedValues, size())).to.equal(2);

      const childMethodAValues = exec(
          childAttachedValues,
          getKey('methodA' as string|symbol),
          pick(1),
          head(),
      )!;
      assert(exec(childMethodAValues, size())).to.equal(1);
      assert([
        ...exec(
            childMethodAValues,
            getKey(ParentClass as Object),
            pick(1),
            head(),
        )!]).to.haveExactElements(['methodAb', 'methodAa']);


      const childMethodBValues = exec(
          childAttachedValues,
          getKey('methodB' as string|symbol),
          pick(1),
          head(),
      )!;
      assert(exec(childMethodBValues, size())).to.equal(1);
      assert([
        ...exec(
            childMethodBValues,
            getKey(ParentClass as Object),
            pick(1),
            head(),
        )!]).to.haveExactElements(['methodBd', 'methodBc']);



      const parentAttachedValues = annotation.getAttachedValuesForCtor(ParentClass);
      assert(exec(parentAttachedValues, size())).to.equal(2);

      const parentMethodAValues = exec(
          parentAttachedValues,
          getKey('methodA' as string|symbol),
          pick(1),
          head(),
      )!;
      assert(exec(parentMethodAValues, size())).to.equal(1);
      assert([
        ...exec(
            parentMethodAValues,
            getKey(ParentClass as Object),
            pick(1),
            head(),
        )!]).to.haveExactElements(['methodAb', 'methodAa']);


      const parentMethodBValues = exec(
          parentAttachedValues,
          getKey('methodB' as string|symbol),
          pick(1),
          head(),
      )!;
      assert(exec(parentMethodBValues, size())).to.equal(1);
      assert([
        ...exec(
            parentMethodBValues,
            getKey(ParentClass as Object),
            pick(1),
            head(),
        )!]).to.haveExactElements(['methodBd', 'methodBc']);
    });
  });
});
