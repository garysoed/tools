import {assert, TestBase} from 'src/test-base';
TestBase.setup();

import {ClassListBinder} from './class-list-binder';


describe('webc.ClassListBinder', () => {
  let mockClassList;
  let binder: ClassListBinder;

  beforeEach(() => {
    mockClassList = jasmine.createSpyObj('ClassList', ['add', 'item', 'remove']);
    binder = new ClassListBinder(<any> {classList: mockClassList});
  });

  function setClassNames(classNames: string[]): void {
    mockClassList.length = classNames.length;
    mockClassList.item.and.callFake((index: number) => {
      return classNames[index];
    });
  }

  describe('delete', () => {
    it('should remove all the class names', () => {
      let className1 = 'className1';
      let className2 = 'className2';
      setClassNames([className1, className2]);

      binder.delete();

      assert(mockClassList.remove).to.haveBeenCalledWith(className1);
      assert(mockClassList.remove).to.haveBeenCalledWith(className2);
    });
  });

  describe('get', () => {
    it('should return the correct class names', () => {
      let className1 = 'className1';
      let className2 = 'className2';
      setClassNames([className1, className2]);

      assert(binder.get()).to.haveElements([className1, className2]);
    });
  });

  describe('set', () => {
    it('should remove all class names that have been removed', () => {
      let removedClassName = 'removedClassName';
      let remainingClassName = 'remainingClassName';
      setClassNames([removedClassName, remainingClassName]);

      binder.set(new Set([remainingClassName, 'otherClassName']));

      assert(mockClassList.remove).to.haveBeenCalledWith(removedClassName);
      assert(mockClassList.remove).toNot.haveBeenCalledWith(remainingClassName);
    });

    it('should add all class names in the given value', () => {
      let newClassName1 = 'newClassName1';
      let newClassName2 = 'newClassName2';

      setClassNames([]);

      binder.set(new Set([newClassName1, newClassName2]));

      assert(mockClassList.add).to.haveBeenCalledWith(newClassName1);
      assert(mockClassList.add).to.haveBeenCalledWith(newClassName2);
    });
  });
});
