import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Arrays } from '../collection/arrays';
import { Mocks } from '../mock/mocks';
import { ChildrenElementsBinder } from '../webc/children-elements-binder';


describe('webc.ChildrenElementsBinder', () => {
  let binder: ChildrenElementsBinder<number>;
  let instance;
  let parentEl: Element;
  let mockDataGetter;
  let mockDataSetter;
  let mockGenerator;

  beforeEach(() => {
    instance = Mocks.object('instance');
    parentEl = document.createElement('div');
    mockDataGetter = jasmine.createSpy('DataGetter');
    mockDataSetter = jasmine.createSpy('DataSetter');
    mockGenerator = jasmine.createSpy('Generator');
    binder = new ChildrenElementsBinder<number>(
        parentEl,
        mockDataGetter,
        mockDataSetter,
        mockGenerator,
        0,
        instance);
  });

  describe('getChildElements_', () => {
    it('should return the elements with the data', () => {
      const child1 = document.createElement('div');
      const child2 = document.createElement('div');
      const child3 = document.createElement('div');
      const child4 = document.createElement('div');
      parentEl.appendChild(child1);
      parentEl.appendChild(child2);
      parentEl.appendChild(child3);
      parentEl.appendChild(child4);

      mockDataGetter.and.callFake((element: any) => {
        return element === child4 ? undefined : {};
      });

      binder['insertionIndex_'] = 1;
      assert(binder['getChildElements_']()).to.equal([child2, child3]);
    });
  });

  describe('getElement_', () => {
    it('should create an element using the generator if the pool is empty', () => {
      const element = Mocks.object('element');
      mockGenerator.and.returnValue(element);

      assert(binder['getElement_']()).to.equal(element);
      assert(binder['elementPool_']).to.haveElements([]);
      assert(mockGenerator).to.haveBeenCalledWith(document, instance);
    });

    it('should reuse an element from the pool', () => {
      const element = Mocks.object('element');

      binder['elementPool_'].add(element);

      assert(binder['getElement_']()).to.equal(element);
      assert(binder['elementPool_']).to.haveElements([]);
      assert(mockGenerator).toNot.haveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should remove all known entries', () => {
      const child1 = document.createElement('div');
      const child2 = document.createElement('div');
      parentEl.appendChild(child1);
      parentEl.appendChild(child2);

      spyOn(parentEl, 'removeChild').and.callThrough();

      binder.delete();

      assert(parentEl.removeChild).to.haveBeenCalledWith(child1);
      assert(parentEl.removeChild).to.haveBeenCalledWith(child2);
    });
  });

  describe('get', () => {
    it('should return a map of all the entries', () => {
      const child1 = document.createElement('div');
      const child2 = document.createElement('div');
      parentEl.appendChild(child1);
      parentEl.appendChild(child2);

      const data1 = Mocks.object('data1');
      const data2 = Mocks.object('data2');
      mockDataGetter.and.callFake((element: any) => {
        switch (element) {
          case child1:
            return data1;
          case child2:
            return data2;
        }
      });

      assert(binder.get()).to.equal([data1, data2]);
      assert(mockDataGetter).to.haveBeenCalledWith(child1);
      assert(mockDataGetter).to.haveBeenCalledWith(child2);
    });
  });

  describe('set', () => {
    it('should add all new entries', () => {
      const value1 = Mocks.object('value1');
      const value2 = Mocks.object('value2');

      const element1 = document.createElement('div1');
      const element2 = document.createElement('div2');
      spyOn(binder, 'getElement_').and.returnValues(element1, element2);

      const existingChild1 = document.createElement('div3');
      const existingChild2 = document.createElement('div4');

      parentEl.appendChild(existingChild1);
      parentEl.appendChild(existingChild2);

      binder['insertionIndex_'] = 1;
      binder.set([value1, value2]);

      assert(mockDataSetter).to.haveBeenCalledWith(value1, element1, instance);
      assert(mockDataSetter).to.haveBeenCalledWith(value2, element2, instance);
      assert(parentEl).to.haveChildren([existingChild1, element1, element2, existingChild2]);
    });

    it('should remove all deleted entries', () => {
      const child1 = document.createElement('div1');
      const child2 = document.createElement('div2');
      const data1 = Mocks.object('data1');
      const data2 = Mocks.object('data2');
      mockDataGetter.and.callFake((element: any) => {
        switch (element) {
          case child1:
            return data1;
          case child2:
            return data2;
        }
      });

      const existingChild1 = document.createElement('div3');
      const existingChild2 = document.createElement('div4');

      parentEl.appendChild(existingChild1);
      parentEl.appendChild(child1);
      parentEl.appendChild(child2);
      parentEl.appendChild(existingChild2);

      spyOn(parentEl, 'removeChild').and.callThrough();

      binder['insertionIndex_'] = 1;
      binder.set([]);

      assert(parentEl).to.haveChildren([existingChild1, existingChild2]);
    });

    it('should update all updated entries', () => {
      const child1 = document.createElement('div1');
      const child2 = document.createElement('div2');
      const data1 = Mocks.object('data1');
      const data2 = Mocks.object('data2');
      mockDataGetter.and.callFake((element: any) => {
        switch (element) {
          case child1:
            return data1;
          case child2:
            return data2;
        }
      });

      parentEl.appendChild(child1);
      parentEl.appendChild(child2);

      const newData1 = Mocks.object('newData1');
      const newData2 = Mocks.object('newData2');

      spyOn(parentEl, 'removeChild').and.callThrough();

      binder.set([newData1, newData2]);

      assert(Arrays.fromItemList(parentEl.children).asArray()).to.equal([child1, child2]);
      assert(mockDataSetter).to.haveBeenCalledWith(newData1, child1, instance);
      assert(mockDataSetter).to.haveBeenCalledWith(newData2, child2, instance);
    });
  });
});
