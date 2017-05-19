import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ImmutableList } from '../immutable/immutable-list';
import { Fakes } from '../mock/fakes';
import { Mocks } from '../mock/mocks';
import { ChildrenElementsBinder } from '../webc/children-elements-binder';


describe('webc.ChildrenElementsBinder', () => {
  let mockDataHelper;
  let binder: ChildrenElementsBinder<number>;
  let instance;
  let parentEl: Element;

  beforeEach(() => {
    instance = Mocks.object('instance');
    parentEl = document.createElement('div');
    mockDataHelper = jasmine.createSpyObj('DataHelper', ['create', 'get', 'set']);
    binder = new ChildrenElementsBinder<number>(
        parentEl,
        mockDataHelper,
        0,
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

      Fakes.build(mockDataHelper.get)
          .when(child4).return()
          .else().return({});

      binder = new ChildrenElementsBinder<number>(
          parentEl,
          mockDataHelper,
          1,
          0,
          instance);
      assert(binder['getChildElements_']()).to.haveElements([child2, child3]);
    });

    it('should not return elements beyond the endPadCount', () => {
      const child1 = document.createElement('div');
      const child2 = document.createElement('div');
      const child3 = document.createElement('div');
      const child4 = document.createElement('div');
      parentEl.appendChild(child1);
      parentEl.appendChild(child2);
      parentEl.appendChild(child3);
      parentEl.appendChild(child4);

      mockDataHelper.get.and.returnValue({});

      binder = new ChildrenElementsBinder<number>(
          parentEl,
          mockDataHelper,
          1,
          1,
          instance);
      assert(binder['getChildElements_']()).to.haveElements([child2, child3]);
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
      Fakes.build(mockDataHelper.get)
          .when(child1).return(data1)
          .when(child2).return(data2);

      assert(binder.get()!).to.equal([data1, data2]);
      assert(mockDataHelper.get).to.haveBeenCalledWith(child1);
      assert(mockDataHelper.get).to.haveBeenCalledWith(child2);
    });
  });

  describe('getElement_', () => {
    it('should create an element using the generator if the pool is empty', () => {
      const element = Mocks.object('element');
      mockDataHelper.create.and.returnValue(element);

      assert(binder['getElement_']()).to.equal(element);
      assert(binder['elementPool_']).to.haveElements([]);
      assert(mockDataHelper.create).to.haveBeenCalledWith(document, instance);
    });

    it('should reuse an element from the pool', () => {
      const element = Mocks.object('element');

      binder['elementPool_'].add(element);

      assert(binder['getElement_']()).to.equal(element);
      assert(binder['elementPool_']).to.haveElements([]);
      assert(mockDataHelper.create).toNot.haveBeenCalled();
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

  describe('set', () => {
    it('should add all new entries', () => {
      const value1 = Mocks.object('value1');
      const value2 = Mocks.object('value2');

      const existingChild1 = document.createElement('div3');
      const existingChild2 = document.createElement('div4');

      parentEl.appendChild(existingChild1);
      parentEl.appendChild(existingChild2);

      binder = new ChildrenElementsBinder<number>(
          parentEl,
          mockDataHelper,
          1,
          0,
          instance);

      const element1 = document.createElement('div1');
      const element2 = document.createElement('div2');
      spyOn(binder, 'getElement_').and.returnValues(element1, element2);
      binder.set([value1, value2]);

      assert(mockDataHelper.set).to.haveBeenCalledWith(value1, element1, instance);
      assert(mockDataHelper.set).to.haveBeenCalledWith(value2, element2, instance);
      assert(parentEl).to.haveChildren([existingChild1, element1, element2, existingChild2]);
    });

    it('should remove all deleted entries', () => {
      const child1 = document.createElement('div1');
      const child2 = document.createElement('div2');
      const data1 = Mocks.object('data1');
      const data2 = Mocks.object('data2');

      Fakes.build(mockDataHelper.get)
          .when(child1).return(data1)
          .when(child2).return(data2);

      const existingChild1 = document.createElement('div3');
      const existingChild2 = document.createElement('div4');

      parentEl.appendChild(existingChild1);
      parentEl.appendChild(child1);
      parentEl.appendChild(child2);
      parentEl.appendChild(existingChild2);

      spyOn(parentEl, 'removeChild').and.callThrough();

      binder = new ChildrenElementsBinder<number>(
          parentEl,
          mockDataHelper,
          1,
          0,
          instance);
      binder.set([]);

      assert(parentEl).to.haveChildren([existingChild1, existingChild2]);
    });

    it('should update all updated entries', () => {
      const child1 = document.createElement('div1');
      const child2 = document.createElement('div2');
      const data1 = Mocks.object('data1');
      const data2 = Mocks.object('data2');
      Fakes.build(mockDataHelper.get)
          .when(child1).return(data1)
          .when(child2).return(data2);

      parentEl.appendChild(child1);
      parentEl.appendChild(child2);

      const newData1 = Mocks.object('newData1');
      const newData2 = Mocks.object('newData2');

      spyOn(parentEl, 'removeChild').and.callThrough();

      binder.set([newData1, newData2]);

      assert(parentEl.children.length).to.equal(2);
      assert(parentEl.children.item(0)).to.equal(child1);
      assert(parentEl.children.item(1)).to.equal(child2);
      assert(mockDataHelper.set).to.haveBeenCalledWith(newData1, child1, instance);
      assert(mockDataHelper.set).to.haveBeenCalledWith(newData2, child2, instance);
    });
  });
});
