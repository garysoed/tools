import { assert } from 'gs-testing/export/main';


import { Serializable } from '../data/a-serializable';
import { DataModel } from '../datamodel/data-model';
import { DataModels } from '../datamodel/data-models';
import { field } from '../datamodel/field';
import { FloatParser } from '../parse/float-parser';
import { StringParser } from '../parse/string-parser';

@Serializable('parent')
abstract class TestParentClass implements DataModel<{}> {
  @field('a', FloatParser) protected readonly a_: number = 1;
  @field('b', StringParser) protected readonly b_: string = 'b';

  abstract getA(): number;

  abstract getB(): string;

  getSearchIndex(): {} {
    throw new Error('Method not implemented.');
  }

  abstract setB(newValue: string): this;
}

@Serializable('test')
abstract class TestClass extends TestParentClass {
  @field('c', FloatParser) protected readonly c_: number = 3;
  @field('d', StringParser) protected readonly d_: string = 'd';

  abstract getC(): number;

  abstract getD(): string;

  abstract setC(newValue: number): this;
}

describe('parse.DataModels_Functional', () => {
  describe('Basic class', () => {
    should(`initialize with default values correctly`, () => {
      const instance = DataModels.newInstance<TestParentClass>(TestParentClass);
      assert(instance.getA()).to.equal(1);
      assert(instance.getB()).to.equal('b');
    });

    should(`set the values correctly`, () => {
      const instance = DataModels.newInstance<TestParentClass>(TestParentClass).setB('c');
      assert(instance.getA()).to.equal(1);
      assert(instance.getB()).to.equal('c');
    });

    should(`return the same instance if setting the same value`, () => {
      const instance = DataModels.newInstance<TestParentClass>(TestParentClass);
      const instance2 = instance.setB('b');
      assert(instance2).to.be(instance);
    });
  });

  describe('Child class', () => {
    should(`initialize with default values correctly`, () => {
      const instance = DataModels.newInstance<TestClass>(TestClass);
      assert(instance.getA()).to.equal(1);
      assert(instance.getB()).to.equal('b');
      assert(instance.getC()).to.equal(3);
      assert(instance.getD()).to.equal('d');
    });

    should(`set the values correctly`, () => {
      const instance = DataModels
          .newInstance<TestClass>(TestClass)
          .setB('c')
          .setC(4);
      assert(instance.getA()).to.equal(1);
      assert(instance.getB()).to.equal('c');
      assert(instance.getC()).to.equal(4);
      assert(instance.getD()).to.equal('d');
    });

    should(`return the same instance if setting the same value`, () => {
      const instance = DataModels.newInstance<TestClass>(TestClass);
      const instance2 = instance.setB('b');
      assert(instance2).to.be(instance);
    });
  });
});
