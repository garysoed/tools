import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { NumberType } from '../check';
import { ImmutableList } from '../immutable';
import { __cache, __value, SwitchSelectorImpl } from '../persona/switch-selector';


describe('persona.SwitchSelectorImpl', () => {
  let mockFactory: any;
  let mockSlotSelector: any;
  let selector: SwitchSelectorImpl<number>;

  beforeEach(() => {
    mockFactory = jasmine.createSpy('Factory');

    const mockSelector = jasmine.createSpyObj('Selector', ['getSelector']);
    mockSelector.getSelector.and.returnValue('');
    mockSlotSelector = jasmine.createSpyObj('SlotSelector', ['getParentSelector', 'getValue']);
    mockSlotSelector.getParentSelector.and.returnValue(mockSelector);
    selector = new SwitchSelectorImpl(
        mockFactory,
        mockSlotSelector,
        NumberType,
        123);
  });

  describe('getCache_', () => {
    it(`should create the cache and return it`, () => {
      const root = Mocks.object('root');

      const map = selector['getCache_'](root);
      assert(map).to.beAnInstanceOf(Map);
      assert(root[__cache]).to.equal(map);
    });

    it(`should reuse existing cache`, () => {
      const cache = Mocks.object('cache');
      const root = Mocks.object('root');
      root[__cache] = cache;

      assert(selector['getCache_'](root)).to.equal(cache);
    });
  });

  describe('getElement_', () => {
    it(`should return the correct element`, () => {
      const element = document.createElement('div');
      const slotStart = document.createComment('start');
      const slotEnd = document.createElement('end');
      const parentEl = document.createElement('div');
      parentEl.appendChild(slotStart);
      parentEl.appendChild(element);
      parentEl.appendChild(slotEnd);

      mockSlotSelector.getValue.and.returnValue({end: slotEnd, start: slotStart});

      const root = Mocks.object('root');

      assert(selector['getElement_'](root)).to.equal(element);
      assert(mockSlotSelector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should return null if the element is not an HTMLElement`, () => {
      const element = document.createComment('element');
      const slotStart = document.createComment('start');
      const slotEnd = document.createElement('end');
      const parentEl = document.createElement('div');
      parentEl.appendChild(slotStart);
      parentEl.appendChild(element);
      parentEl.appendChild(slotEnd);

      mockSlotSelector.getValue.and.returnValue({end: slotEnd, start: slotStart});

      const root = Mocks.object('root');

      assert(selector['getElement_'](root)).to.beNull();
      assert(mockSlotSelector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should return null if there are no elements between the start and end slots`, () => {
      const slotStart = document.createComment('start');
      const slotEnd = document.createElement('end');
      const parentEl = document.createElement('div');
      parentEl.appendChild(slotStart);
      parentEl.appendChild(slotEnd);

      mockSlotSelector.getValue.and.returnValue({end: slotEnd, start: slotStart});

      const root = Mocks.object('root');

      assert(selector['getElement_'](root)).to.beNull();
      assert(mockSlotSelector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should return null if there are no siblings for the start slot element`, () => {
      const slotStart = document.createComment('start');
      const slotEnd = document.createElement('end');

      mockSlotSelector.getValue.and.returnValue({end: slotEnd, start: slotStart});

      const root = Mocks.object('root');

      assert(selector['getElement_'](root)).to.beNull();
      assert(mockSlotSelector.getValue).to.haveBeenCalledWith(root);
    });
  });

  describe('getValue', () => {
    it(`should return the correct value`, () => {
      const root = Mocks.object('root');
      const value = Mocks.object('value');
      const element = Mocks.object('element');
      element[__value] = value;
      spyOn(selector, 'getElement_').and.returnValue(element);

      assert(selector.getValue(root)).to.equal(value);
      assert(selector['getElement_']).to.haveBeenCalledWith(root);
    });

    it(`should return null if there are no values for the element`, () => {
      const root = Mocks.object('root');
      const element = Mocks.object('element');
      spyOn(selector, 'getElement_').and.returnValue(element);

      assert(selector.getValue(root)).to.beNull();
      assert(selector['getElement_']).to.haveBeenCalledWith(root);
    });

    it(`should return null if there are no elements`, () => {
      const root = Mocks.object('root');
      spyOn(selector, 'getElement_').and.returnValue(null);

      assert(selector.getValue(root)).to.beNull();
      assert(selector['getElement_']).to.haveBeenCalledWith(root);
    });
  });

  describe('setElement_', () => {
    it(`should set the element correctly`, () => {
      const root = Mocks.object('root');
      const newElement = document.createElement('div');

      const oldElement = document.createElement('div');
      const slotStart = document.createComment('start');
      const slotEnd = document.createElement('end');
      const parentEl = document.createElement('div');
      parentEl.appendChild(slotStart);
      parentEl.appendChild(oldElement);
      parentEl.appendChild(slotEnd);

      mockSlotSelector.getValue.and.returnValue({end: slotEnd, start: slotStart});
      spyOn(selector, 'getElement_').and.returnValue(oldElement);

      selector['setElement_'](root, newElement);
      assert(ImmutableList.of(parentEl.childNodes))
          .to.haveElements([slotStart, newElement, slotEnd]);
      assert(selector['getElement_']).to.haveBeenCalledWith(root);
      assert(mockSlotSelector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should delete the existing element if the element is null`, () => {
      const root = Mocks.object('root');

      const oldElement = document.createElement('div');
      const slotStart = document.createComment('start');
      const slotEnd = document.createElement('end');
      const parentEl = document.createElement('div');
      parentEl.appendChild(slotStart);
      parentEl.appendChild(oldElement);
      parentEl.appendChild(slotEnd);

      mockSlotSelector.getValue.and.returnValue({end: slotEnd, start: slotStart});
      spyOn(selector, 'getElement_').and.returnValue(oldElement);

      selector['setElement_'](root, null);
      assert(ImmutableList.of(parentEl.childNodes))
          .to.haveElements([slotStart, slotEnd]);
      assert(selector['getElement_']).to.haveBeenCalledWith(root);
      assert(mockSlotSelector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should handle the case where there are no existing elements`, () => {
      const root = Mocks.object('root');
      const newElement = document.createElement('div');

      const slotStart = document.createComment('start');
      const slotEnd = document.createElement('end');
      const parentEl = document.createElement('div');
      parentEl.appendChild(slotStart);
      parentEl.appendChild(slotEnd);

      mockSlotSelector.getValue.and.returnValue({end: slotEnd, start: slotStart});
      spyOn(selector, 'getElement_').and.returnValue(null);

      selector['setElement_'](root, newElement);
      assert(ImmutableList.of(parentEl.childNodes))
          .to.haveElements([slotStart, newElement, slotEnd]);
      assert(selector['getElement_']).to.haveBeenCalledWith(root);
      assert(mockSlotSelector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should do nothing if there are no parent elements`, () => {
      const root = Mocks.object('root');
      const newElement = document.createElement('div');

      const slotStart = document.createComment('start');
      const slotEnd = document.createElement('end');

      mockSlotSelector.getValue.and.returnValue({end: slotEnd, start: slotStart});
      spyOn(selector, 'getElement_').and.returnValue(null);

      selector['setElement_'](root, newElement);
      assert(selector['getElement_']).toNot.haveBeenCalled();
      assert(mockSlotSelector.getValue).to.haveBeenCalledWith(root);
    });
  });

  describe('setValue_', () => {
    it(`should set the element correctly`, () => {
      const value = Mocks.object('value');
      const root = document.createElement('div') as any;
      const newElement = document.createElement('div');
      mockFactory.and.returnValue(newElement);

      const cache = new Map();
      spyOn(selector, 'getCache_').and.returnValue(cache);

      spyOn(selector, 'setElement_');
      spyOn(selector, 'getValue').and.returnValue(null);

      selector['setValue_'](value, root);
      assert(selector['setElement_']).to.haveBeenCalledWith(root, newElement);
      assert(cache).to.haveEntries([[value, newElement]]);
      assert(mockFactory).to.haveBeenCalledWith(document, value);
      assert(selector['getCache_']).to.haveBeenCalledWith(root);
      assert(selector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should reuse cached element`, () => {
      const value = Mocks.object('value');
      const root = document.createElement('div') as any;
      const newElement = document.createElement('div');
      mockFactory.and.returnValue(newElement);

      const cache = new Map();
      cache.set(value, newElement);
      spyOn(selector, 'getCache_').and.returnValue(cache);

      spyOn(selector, 'setElement_');
      spyOn(selector, 'getValue').and.returnValue(null);

      selector['setValue_'](value, root);
      assert(selector['setElement_']).to.haveBeenCalledWith(root, newElement);
      assert(cache).to.haveEntries([[value, newElement]]);
      assert(mockFactory).toNot.haveBeenCalled();
      assert(selector['getCache_']).to.haveBeenCalledWith(root);
      assert(selector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should set the element to null if value is null`, () => {
      const root = document.createElement('div') as any;

      spyOn(selector, 'setElement_');
      spyOn(selector, 'getValue').and.returnValue(Mocks.object('value'));

      selector['setValue_'](null, root);
      assert(selector['setElement_']).to.haveBeenCalledWith(root, null);
      assert(mockFactory).toNot.haveBeenCalled();
      assert(selector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should do nothing if the value has not changed`, () => {
      const value = Mocks.object('value');
      const root = document.createElement('div') as any;
      spyOn(selector, 'getCache_').and.returnValue(new Map());
      spyOn(selector, 'setElement_');
      spyOn(selector, 'getValue').and.returnValue(value);

      selector['setValue_'](value, root);
      assert(selector['setElement_']).toNot.haveBeenCalled();
      assert(mockFactory).toNot.haveBeenCalled();
    });
  });
});
