import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Arrays} from '../collection/arrays';
import {Mocks} from '../mock/mocks';

import {__data, ChildrenElementsBinder} from './children-elements-binder';


describe('webc.ChildrenElementsBinder', () => {
  let binder: ChildrenElementsBinder<number>;
  let instance;
  let parentEl: Element;
  let mockDataSetter;
  let mockGenerator;

  beforeEach(() => {
    instance = Mocks.object('instance');
    parentEl = document.createElement('div');
    mockDataSetter = jasmine.createSpy('DataSetter');
    mockGenerator = jasmine.createSpy('Generator');
    binder = new ChildrenElementsBinder<number>(
        parentEl,
        mockDataSetter,
        mockGenerator,
        0,
        instance);
  });

  describe('getData_', () => {
    it('should return the embedded data', () => {
      let data = Mocks.object('data');
      let element = Mocks.object('element');
      element[__data] = data;

      assert(binder['getData_'](element)).to.equal(data);
    });
  });

  describe('getElement_', () => {
    it('should create an element using the generator if the pool is empty', () => {
      let element = Mocks.object('element');
      mockGenerator.and.returnValue(element);

      assert(binder['getElement_']()).to.equal(element);
      assert(binder['elementPool_']).to.haveElements([]);
      assert(mockGenerator).to.haveBeenCalledWith(document, instance);
    });

    it('should reuse an element from the pool', () => {
      let element = Mocks.object('element');

      binder['elementPool_'].add(element);

      assert(binder['getElement_']()).to.equal(element);
      assert(binder['elementPool_']).to.haveElements([]);
      assert(mockGenerator).toNot.haveBeenCalled();
    });
  });

  describe('setData_', () => {
    it('should embed the data in the given element', () => {
      let element = Mocks.object('element');
      let data = Mocks.object('data');
      binder['setData_'](element, data);

      assert(element[__data]).to.equal(data);
    });
  });

  describe('delete', () => {
    it('should remove all known entries', () => {
      let child1 = document.createElement('div');
      let child2 = document.createElement('div');
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
      let child1 = document.createElement('div');
      let child2 = document.createElement('div');
      parentEl.appendChild(child1);
      parentEl.appendChild(child2);

      let data1 = Mocks.object('data1');
      let data2 = Mocks.object('data2');
      spyOn(binder, 'getData_').and.callFake((element: any) => {
        switch (element) {
          case child1:
            return data1;
          case child2:
            return data2;
        }
      });

      assert(binder.get()).to.equal([data1, data2]);
      assert(binder['getData_']).to.haveBeenCalledWith(child1);
      assert(binder['getData_']).to.haveBeenCalledWith(child2);
    });
  });

  describe('set', () => {
    it('should add all new entries', () => {
      let value1 = Mocks.object('value1');
      let value2 = Mocks.object('value2');

      let element1 = document.createElement('div');
      let element2 = document.createElement('div');
      spyOn(binder, 'getElement_').and.returnValues(element1, element2);
      spyOn(binder, 'setData_');

      let existingChild1 = document.createElement('div');
      let existingChild2 = document.createElement('div');

      parentEl.appendChild(existingChild1);
      parentEl.appendChild(existingChild2);

      binder['insertionIndex_'] = 1;
      binder.set([value1, value2]);

      assert(binder['setData_']).to.haveBeenCalledWith(element1, value1);
      assert(binder['setData_']).to.haveBeenCalledWith(element2, value2);

      assert(mockDataSetter).to.haveBeenCalledWith(value1, element1, instance);
      assert(mockDataSetter).to.haveBeenCalledWith(value2, element2, instance);

      assert(parentEl).to.haveChildren([existingChild1, element1, element2, existingChild2]);
    });

    it('should remove all deleted entries', () => {
      let child1 = document.createElement('div');
      let data1 = Mocks.object('data1');
      child1[__data] = data1;

      let child2 = document.createElement('div');
      let data2 = Mocks.object('data2');
      child2[__data] = data2;

      let existingChild1 = document.createElement('div');
      let existingChild2 = document.createElement('div');

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
      let child1 = document.createElement('div');
      let data1 = Mocks.object('data1');
      child1[__data] = data1;

      let child2 = document.createElement('div');
      let data2 = Mocks.object('data2');
      child2[__data] = data2;

      parentEl.appendChild(child1);
      parentEl.appendChild(child2);

      let newData1 = Mocks.object('newData1');
      let newData2 = Mocks.object('newData2');

      spyOn(parentEl, 'removeChild').and.callThrough();
      spyOn(binder, 'setData_');

      binder.set([newData1, newData2]);

      assert(Arrays.fromItemList(parentEl.children).asArray()).to.equal([child1, child2]);
      assert(binder['setData_']).to.haveBeenCalledWith(child1, newData1);
      assert(binder['setData_']).to.haveBeenCalledWith(child2, newData2);

      assert(mockDataSetter).to.haveBeenCalledWith(newData1, child1, instance);
      assert(mockDataSetter).to.haveBeenCalledWith(newData2, child2, instance);
    });
  });
});
