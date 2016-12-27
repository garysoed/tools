import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';

import {__enumValue, ElementSwitchBinder} from './element-switch-binder';


enum Enum {
  A,
  B,
}

describe('webc.ElementSwitchBinder', () => {
  let mapping: Map<Enum, string>;
  let mockParentEl;
  let binder: ElementSwitchBinder<Enum>;

  beforeEach(() => {
    mapping = new Map();
    mockParentEl = jasmine.createSpyObj('ParentEl', ['querySelector']);
    binder = new ElementSwitchBinder<Enum>(mockParentEl, mapping);
  });

  describe('getEnumValue_', () => {
    it('should set the enum value if it does not exist and return it', () => {
      let id = 'id';
      let element = Mocks.object('element');
      element.id = id;

      mapping.set(Enum.B, id);

      assert(binder['getEnumValue_'](element)).to.equal(Enum.B);
      assert(element[__enumValue]).to.equal(Enum.B);
    });

    it('should not set the enum value if it is invalid', () => {
      let element = Mocks.object('element');
      element.id = 'id';

      mapping.set(Enum.B, 'otherId');

      assert(binder['getEnumValue_'](element)).to.beNull();
      assert(element[__enumValue]).toNot.beDefined(); ;
    });

    it('should reuse the existing enum value', () => {
      let element = Mocks.object('element');
      element.id = 'id';
      element[__enumValue] = Enum.A;

      mapping.set(Enum.B, 'otherId');

      assert(binder['getEnumValue_'](element)).to.equal(Enum.A);
    });
  });

  describe('setActive_', () => {
    it('should remove the display if set to active', () => {
      let element = Mocks.object('element');
      element.style = {};
      binder['setActive_'](element, true);
      assert(element.style.display).to.equal('');
    });

    it('should set the display to none if set to inactive', () => {
      let element = Mocks.object('element');
      element.style = {};
      binder['setActive_'](element, false);
      assert(element.style.display).to.equal('none');
    });
  });

  describe('delete', () => {
    it('should set the currently active element as inactive', () => {
      let activeEl = Mocks.object('activeEl');
      binder['currentActiveEl_'] = activeEl;

      spyOn(binder, 'setActive_');

      binder.delete();

      assert(binder['setActive_']).to.haveBeenCalledWith(activeEl, false);
    });

    it('should not throw errors if there are no currently active elements', () => {
      binder['currentActiveEl_'] = null;
      spyOn(binder, 'setActive_');

      binder.delete();

      assert(binder['setActive_']).toNot.haveBeenCalled();
    });
  });

  describe('get', () => {
    it('should return the correct enum value if there is an active element', () => {
      let activeEl = Mocks.object('activeEl');
      binder['currentActiveEl_'] = activeEl;

      let enumValue = Enum.B;
      spyOn(binder, 'getEnumValue_').and.returnValue(enumValue);

      assert(binder.get()).to.equal(enumValue);
      assert(binder['getEnumValue_']).to.haveBeenCalledWith(activeEl);
    });

    it('should return null if there are no active elements', () => {
      binder['currentActiveEl_'] = null;
      spyOn(binder, 'getEnumValue_');

      assert(binder.get()).to.beNull();
      assert(binder['getEnumValue_']).toNot.haveBeenCalled();
    });
  });

  describe('set', () => {
    it('should delete the old value, cache the element enum value and set it to active', () => {
      let element = Mocks.object('element');
      Object.setPrototypeOf(element, HTMLElement.prototype);
      mockParentEl.querySelector.and.returnValue(element);

      let id = 'id';
      let enumValue = Enum.B;
      mapping.set(enumValue, id);

      spyOn(binder, 'delete');
      spyOn(binder, 'setActive_');

      binder.set(enumValue);

      assert(binder['setActive_']).to.haveBeenCalledWith(element, true);
      assert(binder.delete).to.haveBeenCalledWith();
      assert(element[__enumValue]).to.equal(enumValue);
      assert(mockParentEl.querySelector).to.haveBeenCalledWith(`#${id}`);
    });

    it('should do nothing if the element is not an HTMLElement', () => {
      let element = Mocks.object('element');
      mockParentEl.querySelector.and.returnValue(element);

      let id = 'id';
      let enumValue = Enum.B;
      mapping.set(enumValue, id);

      spyOn(binder, 'delete');
      spyOn(binder, 'setActive_');

      binder.set(enumValue);

      assert(binder['setActive_']).toNot.haveBeenCalled();
      assert(binder.delete).to.haveBeenCalledWith();
      assert(element[__enumValue]).toNot.beDefined();
      assert(mockParentEl.querySelector).to.haveBeenCalledWith(`#${id}`);
    });

    it('should not throw error if the element cannot be found', () => {
      mockParentEl.querySelector.and.returnValue(null);

      let id = 'id';
      let enumValue = Enum.B;
      mapping.set(enumValue, id);

      spyOn(binder, 'delete');

      assert(() => {
        binder.set(enumValue);
      }).toNot.throw();
      assert(binder.delete).to.haveBeenCalledWith();
    });

    it('should not throw error if the value has no corresponding ID', () => {
      spyOn(binder, 'delete');

      assert(() => {
        binder.set(Enum.B);
      }).toNot.throw();
      assert(binder.delete).to.haveBeenCalledWith();
    });

    it('should do nothing if the value to set is null', () => {
      spyOn(binder, 'delete');

      assert(() => {
        binder.set(null);
      }).toNot.throw();
      assert(binder.delete).to.haveBeenCalledWith();
    });
  });
});
