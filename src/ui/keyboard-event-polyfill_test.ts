import {TestBase} from '../test-base';
TestBase.setup();

import Cache from '../data/a-cache';
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
    Cache.clear(KeyboardEventPolyfill);
    KeyboardEventPolyfill.polyfill();
  });

  it('should throw error if the KeyboardEvent cannot be found', () => {
    window['KeyboardEvent'] = undefined;
    Cache.clear(KeyboardEventPolyfill);
    expect(() => {
      KeyboardEventPolyfill.polyfill();
    }).toThrowError(/KeyboardEvent not defined/);
  });

  describe('polyfill key', () => {
    it('should return the value correctly', () => {
      let event = new MockKeyboardEvent(97);
      expect(event['key']).toEqual('a');
    });

    it('should throw error if the event has no charCode', () => {
      let event = new MockKeyboardEvent(undefined);
      expect(() => {
        event['key'];
      }).toThrowError(/Unhandled KeyboardEvent platform/);
    });
  });
});
