import { assert, Fakes, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { InstanceofType, NumberType } from '../check';
import { ImmutableList } from '../immutable';
import { childrenSelector } from '../persona';
import { ChildrenSelectorImpl } from '../persona/children-selector';
import { ElementSelectorImpl } from '../persona/element-selector';


// describe('persona.ChildrenSelectorStub', () => {
//   describe('resolve', () => {
//     xit(`should return the correct selector`);
//   });
// });

describe('persona.ChildrenSelectorImpl', () => {
  let mockElementSelector: any;
  let mockFactory: any;
  let mockGetter: any;
  let mockSetter: any;
  let selector: ChildrenSelectorImpl<HTMLDivElement, number>;

  beforeEach(() => {
    mockElementSelector = jasmine.createSpyObj('ElementSelector', ['getValue']);
    Object.setPrototypeOf(mockElementSelector, ElementSelectorImpl.prototype);

    mockFactory = jasmine.createSpy('Factory');
    mockGetter = jasmine.createSpy('Getter');
    mockSetter = jasmine.createSpy('Setter');
    selector = childrenSelector(
        mockElementSelector,
        mockFactory,
        mockGetter,
        mockSetter,
        NumberType,
        InstanceofType(HTMLDivElement)) as ChildrenSelectorImpl<HTMLDivElement, number>;
  });

  describe('getChildElements_', () => {
    it('should return the elements', () => {
      const child1 = document.createElement('div');
      const child2 = document.createElement('div');
      const child3 = document.createElement('div');
      const child4 = document.createElement('div');
      const parentEl = document.createElement('div');
      parentEl.appendChild(child1);
      parentEl.appendChild(child2);
      parentEl.appendChild(child3);
      parentEl.appendChild(child4);

      mockElementSelector.getValue.and.returnValue(parentEl);

      selector = childrenSelector(
          mockElementSelector,
          mockFactory,
          mockGetter,
          mockSetter,
          NumberType,
          InstanceofType(HTMLDivElement),
          {end: 0, start: 1}) as ChildrenSelectorImpl<HTMLDivElement, number>;
      const root = Mocks.object('root');

      assert(selector['getChildElements_'](root) as ImmutableList<any>)
          .to.haveElements([child2, child3, child4]);
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(root);
    });

    it('should not return elements beyond the endPadCount', () => {
      const child1 = document.createElement('div');
      const child2 = document.createElement('div');
      const child3 = document.createElement('div');
      const child4 = document.createElement('div');
      const parentEl = document.createElement('div');
      parentEl.appendChild(child1);
      parentEl.appendChild(child2);
      parentEl.appendChild(child3);
      parentEl.appendChild(child4);

      mockElementSelector.getValue.and.returnValue(parentEl);

      selector = childrenSelector(
          mockElementSelector,
          mockFactory,
          mockGetter,
          mockSetter,
          NumberType,
          InstanceofType(HTMLDivElement),
          {end: 1, start: 1}) as ChildrenSelectorImpl<HTMLDivElement, number>;
      const root = Mocks.object('root');
      assert(selector['getChildElements_'](root) as ImmutableList<any>)
          .to.haveElements([child2, child3]);
    });

    it(`should throw error if the child element type is incorrect`, () => {
      const child = document.createElement('a');
      const parentEl = document.createElement('div');
      parentEl.appendChild(child);

      mockElementSelector.getValue.and.returnValue(parentEl);

      const root = Mocks.object('root');
      assert(() => {
        selector['getChildElements_'](root);
      }).to.throwError(/HTMLDivElement/);
    });
  });

  describe('getElement_', () => {
    it('should create an element using the generator if the pool is empty', () => {
      const element = Mocks.object('element');
      mockFactory.and.returnValue(element);

      const parentEl = document.createElement('div');

      assert(selector['getElement_'](parentEl)).to.equal(element);
      assert(selector['elementPool_']).to.haveElements([]);
      assert(mockFactory).to.haveBeenCalledWith(document);
    });

    it('should reuse an element from the pool', () => {
      const element = Mocks.object('element');

      selector['elementPool_'].add(element);
      const parentEl = document.createElement('div');

      assert(selector['getElement_'](parentEl)).to.equal(element);
      assert(selector['elementPool_']).to.haveElements([]);
      assert(mockFactory).toNot.haveBeenCalled();
    });
  });

  describe('getValue', () => {
    it('should return a map of all the entries', () => {
      const child1 = document.createElement('div');
      const child2 = document.createElement('div');
      spyOn(selector, 'getChildElements_').and.returnValue(ImmutableList.of([child1, child2]));

      const data1 = 123;
      const data2 = 234;
      Fakes.build(mockGetter)
          .when(child1).return(data1)
          .when(child2).return(data2);
      const root = Mocks.object('root');

      assert(selector.getValue(root)).to.haveElements([data1, data2]);
      assert(mockGetter).to.haveBeenCalledWith(child1);
      assert(mockGetter).to.haveBeenCalledWith(child2);
      assert(selector['getChildElements_']).to.haveBeenCalledWith(root);
    });

    it(`should throw error if one of the child data types is wrong`, () => {
      const child = document.createElement('div');
      spyOn(selector, 'getChildElements_').and.returnValue(ImmutableList.of([child]));

      mockGetter.and.returnValue({});
      const root = Mocks.object('root');

      assert(() => {
        selector.getValue(root);
      }).to.throwError(/be \[number\]/);
      assert(selector['getChildElements_']).to.haveBeenCalledWith(root);
    });
  });

  describe('setValue', () => {
    it('should add all new entries', () => {
      const value1 = Mocks.object('value1');
      const value2 = Mocks.object('value2');

      const existingChild1 = document.createElement('div');
      const existingChild2 = document.createElement('div');
      const parentEl = document.createElement('div');
      parentEl.appendChild(existingChild1);
      parentEl.appendChild(existingChild2);
      mockElementSelector.getValue.and.returnValue(parentEl);

      const element1 = document.createElement('div');
      const element2 = document.createElement('div');

      selector = childrenSelector(
          mockElementSelector,
          mockFactory,
          mockGetter,
          mockSetter,
          NumberType,
          InstanceofType(HTMLDivElement),
          {end: 1, start: 1}) as ChildrenSelectorImpl<HTMLDivElement, number>;
      spyOn(selector, 'getElement_').and.returnValues(element1, element2);

      selector.setValue(ImmutableList.of([value1, value2]), document as any);
      assert(mockSetter).to.haveBeenCalledWith(value1, element1);
      assert(mockSetter).to.haveBeenCalledWith(value2, element2);
      assert(parentEl).to.haveChildren([existingChild1, element1, element2, existingChild2]);
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(document);
    });

    it('should remove all deleted entries', () => {
      const child1 = document.createElement('div');
      const child2 = document.createElement('div');
      const data1 = Mocks.object('data1');
      const data2 = Mocks.object('data2');

      Fakes.build(mockGetter)
          .when(child1).return(data1)
          .when(child2).return(data2);

      const existingChild1 = document.createElement('div');
      const existingChild2 = document.createElement('div');

      const parentEl = document.createElement('div');
      parentEl.appendChild(existingChild1);
      parentEl.appendChild(child1);
      parentEl.appendChild(child2);
      parentEl.appendChild(existingChild2);
      mockElementSelector.getValue.and.returnValue(parentEl);

      spyOn(parentEl, 'removeChild').and.callThrough();

      selector = childrenSelector(
          mockElementSelector,
          mockFactory,
          mockGetter,
          mockSetter,
          NumberType,
          InstanceofType(HTMLDivElement),
          {end: 1, start: 1}) as ChildrenSelectorImpl<HTMLDivElement, number>;
      selector.setValue(ImmutableList.of([]), document as any);

      assert(parentEl).to.haveChildren([existingChild1, existingChild2]);
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(document);
    });

    it('should update all updated entries', () => {
      const child1 = document.createElement('div');
      const child2 = document.createElement('div');
      const data1 = Mocks.object('data1');
      const data2 = Mocks.object('data2');
      Fakes.build(mockGetter)
          .when(child1).return(data1)
          .when(child2).return(data2);

      const parentEl = document.createElement('div');
      parentEl.appendChild(child1);
      parentEl.appendChild(child2);
      mockElementSelector.getValue.and.returnValue(parentEl);

      const newData1 = Mocks.object('newData1');
      const newData2 = Mocks.object('newData2');

      spyOn(parentEl, 'removeChild').and.callThrough();

      selector.setValue(ImmutableList.of([newData1, newData2]), document as any);

      assert(parentEl.children.length).to.equal(2);
      assert(parentEl.children.item(0)).to.equal(child1);
      assert(parentEl.children.item(1)).to.equal(child2);
      assert(mockSetter).to.haveBeenCalledWith(newData1, child1);
      assert(mockSetter).to.haveBeenCalledWith(newData2, child2);
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(document);
    });
  });
});
