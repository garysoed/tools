import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Serializable } from '../data/a-serializable';
import { DataModel } from '../datamodel/data-model';
import { DataModels } from '../datamodel/data-models';
import { field } from '../datamodel/field';

@Serializable('parent')
abstract class TestParentClass implements DataModel<{}> {
  @field('a') protected readonly a_: number = 1;
  @field('b') protected readonly b_: string = 'b';

  abstract getA(): number;

  abstract getB(): string;

  getSearchIndex(): {} {
    throw new Error('Method not implemented.');
  }

  abstract setB(newValue: string): this;
}

@Serializable('test')
abstract class TestClass extends TestParentClass {
  @field('c') protected readonly c_: number = 3;
  @field('d') protected readonly d_: string = 'd';

  abstract getC(): number;

  abstract getD(): string;

  abstract setC(newValue: number): this;
}

describe('datamodel.DataModels', () => {
  describe('Basic class', () => {
    it(`should initialize with default values correctly`, () => {
      const instance = DataModels.newInstance<TestParentClass>(TestParentClass);
      assert(instance.getA()).to.equal(1);
      assert(instance.getB()).to.equal('b');
    });

    it(`should set the values correctly`, () => {
      const instance = DataModels.newInstance<TestParentClass>(TestParentClass).setB('c');
      assert(instance.getA()).to.equal(1);
      assert(instance.getB()).to.equal('c');
    });

    it(`should return the same instance if setting the same value`, () => {
      const instance = DataModels.newInstance<TestParentClass>(TestParentClass);
      const instance2 = instance.setB('b');
      assert(instance2).to.be(instance);
    });

    it(`should serialize correctly`, () => {
      const instance = DataModels.newInstance<TestParentClass>(TestParentClass);
      assert(DataModels.toJson(instance)).to.equal({
        '_type': 'parent',
        'a': 1,
        'b': 'b',
      });
    });

    it(`should deserialize correctly`, () => {
      const instance = DataModels.fromJson<TestParentClass>({'_type': 'parent', 'a': 1, 'b': 'b'});
      assert(instance.getA()).to.equal(1);
      assert(instance.getB()).to.equal('b');
    });
  });

  describe('Child class', () => {
    it(`should initialize with default values correctly`, () => {
      const instance = DataModels.newInstance<TestClass>(TestClass);
      assert(instance.getA()).to.equal(1);
      assert(instance.getB()).to.equal('b');
      assert(instance.getC()).to.equal(3);
      assert(instance.getD()).to.equal('d');
    });

    it(`should set the values correctly`, () => {
      const instance = DataModels
          .newInstance<TestClass>(TestClass)
          .setB('c')
          .setC(4);
      assert(instance.getA()).to.equal(1);
      assert(instance.getB()).to.equal('c');
      assert(instance.getC()).to.equal(4);
      assert(instance.getD()).to.equal('d');
    });

    it(`should return the same instance if setting the same value`, () => {
      const instance = DataModels.newInstance<TestClass>(TestClass);
      const instance2 = instance.setB('b');
      assert(instance2).to.be(instance);
    });

    it(`should serialize correctly`, () => {
      const instance = DataModels.newInstance<TestClass>(TestClass);
      assert(DataModels.toJson(instance)).to.equal({
        '_type': 'test',
        'a': 1,
        'b': 'b',
        'c': 3,
        'd': 'd',
      });
    });

    it(`should deserialize correctly`, () => {
      const instance = DataModels.fromJson<TestClass>({
        '_type': 'test',
        'a': 1,
        'b': 'b',
        'c': 3,
        'd': 'd',
      });
      assert(instance.getA()).to.equal(1);
      assert(instance.getB()).to.equal('b');
      assert(instance.getC()).to.equal(3);
      assert(instance.getD()).to.equal('d');
    });
  });
});
