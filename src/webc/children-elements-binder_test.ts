import {assert, TestBase} from '../test-base';
TestBase.setup();

import {ChildrenElementsBinder} from './children-elements-binder';
import {Mocks} from '../mock/mocks';


describe('webc.ChildrenElementsBinder', () => {
  let binder: ChildrenElementsBinder<number>;
  let mockParentEl;
  let mockDataSetter;
  let mockGenerator;

  beforeEach(() => {
    mockParentEl = jasmine.createSpyObj('ParentEl', ['appendChild', 'removeChild']);
    mockDataSetter = jasmine.createSpy('DataSetter');
    mockGenerator = jasmine.createSpy('Generator');
    binder = new ChildrenElementsBinder<number>(
        mockParentEl,
        mockDataSetter,
        mockGenerator);
  });

  describe('addEntry_', () => {
    it('should create a new element, apply the data to it, and add it to the parent element',
        () => {
          let key = 'key';
          let value = 123;
          let document = Mocks.object('document');
          mockParentEl.ownerDocument = document;

          let element = Mocks.object('element');
          mockGenerator.and.returnValue(element);

          binder['addEntry_'](key, value);

          assert(mockParentEl.appendChild).to.haveBeenCalledWith(element);
          assert(binder['entries_']).to.haveEntries([[key, [element, value]]]);
          assert(mockDataSetter).to.haveBeenCalledWith(value, element);
          assert(binder['elementPool_']).to.haveElements([]);
          assert(mockGenerator).to.haveBeenCalledWith(document);
        });

    it('should reuse an element from the pool', () => {
        let key = 'key';
        let value = 123;
        let element = Mocks.object('element');

        binder['elementPool_'].add(element);
        binder['addEntry_'](key, value);

        assert(mockParentEl.appendChild).to.haveBeenCalledWith(element);
        assert(binder['entries_']).to.haveEntries([[key, [element, value]]]);
        assert(mockDataSetter).to.haveBeenCalledWith(value, element);
        assert(binder['elementPool_']).to.haveElements([]);
        assert(mockGenerator).toNot.haveBeenCalled();
    });

    it('should remove existing entry', () => {
      let key = 'key';
      mockGenerator.and.returnValue(Mocks.object('element'));

      spyOn(binder, 'removeEntry_');

      binder['entries_'].set(key, Mocks.object('entry'));
      binder['addEntry_'](key, 123);

      assert(binder['removeEntry_']).to.haveBeenCalledWith(key);
    });
  });

  describe('removeEntry_', () => {
    it('should remove the element and put it back to the pool', () => {
      let key = 'key';
      let element = Mocks.object('element');

      binder['entries_'].set(key, [element, 123]);

      binder['removeEntry_'](key);

      assert(binder['entries_']).to.haveEntries([]);
      assert(mockParentEl.removeChild).to.haveBeenCalledWith(element);
      assert(binder['elementPool_']).to.haveElements([element]);
    });

    it('should do nothing if the key does not exist', () => {
      binder['removeEntry_']('key');

      assert(mockParentEl.removeChild).toNot.haveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should remove all known entries', () => {
      let key1 = 'key1';
      let key2 = 'key2';
      binder['entries_'].set(key1, Mocks.object('entry1'));
      binder['entries_'].set(key2, Mocks.object('entry2'));

      spyOn(binder, 'removeEntry_');

      binder.delete();

      assert(binder['removeEntry_']).to.haveBeenCalledWith(key1);
      assert(binder['removeEntry_']).to.haveBeenCalledWith(key2);
    });
  });

  describe('get', () => {
    it('should return a map of all the entries', () => {
      let key1 = 'key1';
      let value1 = Mocks.object('value1');
      let key2 = 'key2';
      let value2 = Mocks.object('value2');

      binder['entries_'].set(key1, [Mocks.object('element1'), value1]);
      binder['entries_'].set(key2, [Mocks.object('element2'), value2]);

      assert(binder.get()).to.haveEntries([[key1, value1], [key2, value2]]);
    });
  });

  describe('set', () => {
    it('should add all new entries', () => {
      let key1 = 'key1';
      let value1 = Mocks.object('value1');
      let key2 = 'key2';
      let value2 = Mocks.object('value2');

      let newValue = new Map([[key1, value1], [key2, value2]]);
      spyOn(binder, 'addEntry_');
      spyOn(binder, 'removeEntry_');

      binder.set(newValue);

      assert(binder['addEntry_']).to.haveBeenCalledWith(key1, value1);
      assert(binder['addEntry_']).to.haveBeenCalledWith(key2, value2);
      assert(binder['removeEntry_']).toNot.haveBeenCalled();
      assert(mockDataSetter).toNot.haveBeenCalled();
    });

    it('should remove all deleted entries', () => {
      let key1 = 'key1';
      let value1 = Mocks.object('value1');
      let key2 = 'key2';
      let value2 = Mocks.object('value2');

      binder['entries_'].set(key1, value1);
      binder['entries_'].set(key2, value2);

      spyOn(binder, 'addEntry_');
      spyOn(binder, 'removeEntry_');

      binder.set(new Map());

      assert(binder['addEntry_']).toNot.haveBeenCalled();
      assert(binder['removeEntry_']).to.haveBeenCalledWith(key1);
      assert(binder['removeEntry_']).to.haveBeenCalledWith(key2);
      assert(mockDataSetter).toNot.haveBeenCalled();
    });

    it('should update all updated entries', () => {
      let key1 = 'key1';
      let newValue1 = 111;
      let element1 = Mocks.object('element1');

      let key2 = 'key2';
      let newValue2 = 222;
      let element2 = Mocks.object('element2');

      let newValue = new Map([[key1, newValue1], [key2, newValue2]]);
      binder['entries_'].set(key1, [element1, 1]);
      binder['entries_'].set(key2, [element2, 2]);

      spyOn(binder, 'addEntry_');
      spyOn(binder, 'removeEntry_');

      binder.set(newValue);

      assert(binder['addEntry_']).toNot.haveBeenCalled();
      assert(binder['removeEntry_']).toNot.haveBeenCalled();
      assert(mockDataSetter).to.haveBeenCalledWith(newValue1, element1);
      assert(mockDataSetter).to.haveBeenCalledWith(newValue2, element2);
    });
  });
});
