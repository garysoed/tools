import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Fakes } from '../mock/fakes';
import { ClassListBinder } from '../webc/class-list-binder';


describe('webc.ClassListBinder', () => {
  let mockClassList;
  let binder: ClassListBinder;

  beforeEach(() => {
    mockClassList = jasmine.createSpyObj('ClassList', ['add', 'item', 'remove']);
    binder = new ClassListBinder({classList: mockClassList} as any);
  });

  function setClassNames(classNames: string[]): void {
    mockClassList.length = classNames.length;
    Fakes.build(mockClassList.item).call((index: number) => classNames[index]);
  }

  describe('delete', () => {
    it('should remove all the class names', () => {
      const className1 = 'className1';
      const className2 = 'className2';
      setClassNames([className1, className2]);

      binder.delete();

      assert(mockClassList.remove).to.haveBeenCalledWith(className1);
      assert(mockClassList.remove).to.haveBeenCalledWith(className2);
    });
  });

  describe('get', () => {
    it('should return the correct class names', () => {
      const className1 = 'className1';
      const className2 = 'className2';
      setClassNames([className1, className2]);

      assert(binder.get()).to.haveElements([className1, className2]);
    });
  });

  describe('set', () => {
    it('should remove all class names that have been removed', () => {
      const removedClassName = 'removedClassName';
      const remainingClassName = 'remainingClassName';
      setClassNames([removedClassName, remainingClassName]);

      binder.set(new Set([remainingClassName, 'otherClassName']));

      assert(mockClassList.remove).to.haveBeenCalledWith(removedClassName);
      assert(mockClassList.remove).toNot.haveBeenCalledWith(remainingClassName);
    });

    it('should add all class names in the given value', () => {
      const newClassName1 = 'newClassName1';
      const newClassName2 = 'newClassName2';

      setClassNames([]);

      binder.set(new Set([newClassName1, newClassName2]));

      assert(mockClassList.add).to.haveBeenCalledWith(newClassName1);
      assert(mockClassList.add).to.haveBeenCalledWith(newClassName2);
    });
  });
});
