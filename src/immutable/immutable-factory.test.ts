import { assert, setup, should, test } from '@gs-testing';
import { SerializableObject } from '@nabu';
import { generateImmutable as createImmutable, ImmutableFactory } from './immutable-factory';

interface SerializableParent extends SerializableObject {
  pIndex: number;
  pName: string;
}

interface SerializableChild extends SerializableParent {
  cIndex: number;
  cName: string;
}

class ParentSpec {
  constructor(private readonly pSerializable: SerializableParent) { }

  get name(): string {
    return this.pSerializable.pName;
  }

  set name(newName: string) {
    this.pSerializable.pName = newName;
  }

  get index(): number {
    return this.pSerializable.pIndex;
  }
}

class ChildSpec extends ParentSpec {
  constructor(private readonly cSerializable: SerializableChild) {
    super(cSerializable);
  }

  get name(): string {
    return this.cSerializable.cName;
  }

  set name(newName: string) {
    this.cSerializable.cName = newName;
  }

  get cIndex(): number {
    return this.cSerializable.cIndex;
  }
}

test('@gs-tools/immutable/immutable-factory', () => {
  test('parentSpec', () => {
    let factory: ImmutableFactory<ParentSpec, SerializableParent>;

    setup(() => {
      factory = createImmutable(ParentSpec);
    });

    should(`be immutable`, () => {
      const pIndex = 123;
      const pName = 'pName';

      const instance = factory.create({pIndex, pName});
      assert(instance.index).to.equal(pIndex);
      assert(instance.name).to.equal(pName);

      const newName = 'newName';
      const instance2 = instance.$update(instance.$set.name(newName));
      assert(instance.index).to.equal(pIndex);
      assert(instance.name).to.equal(pName);
      assert(instance2.index).to.equal(pIndex);
      assert(instance2.name).to.equal(newName);
    });
  });

  test('childSpec', () => {
    let factory: ImmutableFactory<ChildSpec, SerializableChild>;

    setup(() => {
      factory = createImmutable(ChildSpec);
    });

    should(`be immutable`, () => {
      const pIndex = 123;
      const pName = 'pName';
      const cIndex = 456;
      const cName = 'cName';

      const instance = factory.create({cIndex, cName, pIndex, pName});
      assert(instance.cIndex).to.equal(cIndex);
      assert(instance.index).to.equal(pIndex);
      assert(instance.name).to.equal(cName);

      const newName = 'newName';
      const instance2 = instance.$update(instance.$set.name(newName));
      assert(instance.cIndex).to.equal(cIndex);
      assert(instance.index).to.equal(pIndex);
      assert(instance.name).to.equal(cName);
      assert(instance2.cIndex).to.equal(cIndex);
      assert(instance2.index).to.equal(pIndex);
      assert(instance2.name).to.equal(newName);
    });
  });
});
