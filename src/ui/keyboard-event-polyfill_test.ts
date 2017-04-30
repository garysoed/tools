import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Caches } from '../data/caches';

import KeyboardEventPolyfill from './keyboard-event-polyfill';


describe('ui.KeyboardEventPolyfill', () => {
  let MockKeyboardEvent;

  beforeEach(() => {
    class KeyboardEvent {
      private charCode_: number;

      constructor(charCode: number) {
        this.charCode_ = charCode;
      }

      get charCode(): number {
        return this.charCode_;
      }
    }

    MockKeyboardEvent = KeyboardEvent;
    window['KeyboardEvent'] = MockKeyboardEvent;
    Caches.clearAll(KeyboardEventPolyfill);
    KeyboardEventPolyfill.polyfill();
  });

  it('should throw error if the KeyboardEvent cannot be found', () => {
    window['KeyboardEvent'] = undefined;
    Caches.clearAll(KeyboardEventPolyfill);
    assert(() => {
      KeyboardEventPolyfill.polyfill();
    }).to.throwError(/KeyboardEvent not defined/);
  });

  describe('polyfill key', () => {
    it('should return the value correctly', () => {
      const event = new MockKeyboardEvent(97);
      assert(event['key']).to.equal('a');
    });

    it('should throw error if the event has no charCode', () => {
      const event = new MockKeyboardEvent(undefined);
      assert(() => {
        event['key'];
      }).to.throwError(/Unhandled KeyboardEvent platform/);
    });
  });
});
