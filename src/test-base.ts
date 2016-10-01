import {TestAsync} from './testing/test-async';
import {TestDispose} from './testing/test-dispose';
import {TestEvent} from './testing/test-event';
import {TestListenableDom} from './testing/test-listenable-dom';
import {TestSetup} from './testing/test-setup';


export {assert} from './jasmine/assert';
export {Matchers} from './jasmine/matchers';


const TEST_SETUP = new TestSetup([
  TestAsync,
  TestDispose,
  TestEvent,
  TestListenableDom,
]);

let initialized = false;

export const TestBase = {
  setup(): void {
    if (!initialized) {
      TEST_SETUP.setup();
      initialized = true;
    }
  },
};
