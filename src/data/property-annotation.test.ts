import { assert, match, setup, should, test } from 'gs-testing/export/main';
import { ImmutableList } from '../collect/immutable-list';
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

      assert(annotation.getAttachedValues(DescendantClass, 'methodA')).to.haveElements([
        match.anyTupleThat<Tuple>().haveExactElements([
            DescendantClass,
            match.anyIterableThat<string, ImmutableList<string>>().haveElements([
              'methodAf',
              'methodAe',
            ]),
        ]),
        match.anyTupleThat<Tuple>().haveExactElements([
            ParentClass,
            match.anyIterableThat<string, ImmutableList<string>>().haveElements([
              'methodAb',
              'methodAa',
            ]),
        ]),
      ]);

      assert(annotation.getAttachedValues(ChildClass, 'methodA')).to.haveElements([
        match.anyTupleThat<Tuple>().haveExactElements([
            ParentClass,
            match.anyIterableThat<string, ImmutableList<string>>().haveElements([
              'methodAb',
              'methodAa',
            ]),
        ]),
      ]);

      assert(annotation.getAttachedValues(ParentClass, 'methodA')).to.haveElements([
        match.anyTupleThat<Tuple>().haveExactElements([
            ParentClass,
            match.anyIterableThat<string, ImmutableList<string>>().haveElements([
              'methodAb',
              'methodAa',
            ]),
        ]),
      ]);
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

      assert(annotation.getAttachedValuesForCtor(DescendantClass)).to.haveElements([
        [
          'methodA',
          match.anyIterableThat<Tuple, ImmutableList<Tuple>>().haveElements([
            match.anyTupleThat<Tuple>().haveExactElements([
                DescendantClass,
                match.anyIterableThat<string, ImmutableList<string>>().haveElements([
                  'methodAf',
                  'methodAe',
                ]),
            ]),
            match.anyTupleThat<Tuple>().haveExactElements([
                ParentClass,
                match.anyIterableThat<string, ImmutableList<string>>().haveElements([
                  'methodAb',
                  'methodAa',
                ]),
            ]),
          ]),
        ],
        [
          'methodB',
          match.anyIterableThat<Tuple, ImmutableList<Tuple>>().haveElements([
            match.anyTupleThat<Tuple>().haveExactElements([
                ParentClass,
                match.anyIterableThat<string, ImmutableList<string>>().haveElements([
                  'methodBd',
                  'methodBc',
                ]),
            ]),
          ]),
        ],
      ]);

      assert(annotation.getAttachedValuesForCtor(ChildClass)).to.haveElements([
        [
          'methodA',
          match.anyIterableThat<Tuple, ImmutableList<Tuple>>().haveElements([
            match.anyTupleThat<Tuple>().haveExactElements([
                ParentClass,
                match.anyIterableThat<string, ImmutableList<string>>().haveElements([
                  'methodAb',
                  'methodAa',
                ]),
            ]),
          ]),
        ],
        [
          'methodB',
          match.anyIterableThat<Tuple, ImmutableList<Tuple>>().haveElements([
            match.anyTupleThat<Tuple>().haveExactElements([
                ParentClass,
                match.anyIterableThat<string, ImmutableList<string>>().haveElements([
                  'methodBd',
                  'methodBc',
                ]),
            ]),
          ]),
        ],
      ]);

      assert(annotation.getAttachedValuesForCtor(ParentClass)).to.haveElements([
        [
          'methodA',
          match.anyIterableThat<Tuple, ImmutableList<Tuple>>().haveElements([
            match.anyTupleThat<Tuple>().haveExactElements([
                ParentClass,
                match.anyIterableThat<string, ImmutableList<string>>().haveElements([
                  'methodAb',
                  'methodAa',
                ]),
            ]),
          ]),
        ],
        [
          'methodB',
          match.anyIterableThat<Tuple, ImmutableList<Tuple>>().haveElements([
            match.anyTupleThat<Tuple>().haveExactElements([
                ParentClass,
                match.anyIterableThat<string, ImmutableList<string>>().haveElements([
                  'methodBd',
                  'methodBc',
                ]),
            ]),
          ]),
        ],
      ]);
    });
  });
});
