import DisposableTestSetup from './testing/disposable-test-setup';
import EventTestSetup from './testing/event-test-setup';
import TestSetup from './testing/test-setup';


const TEST_SETUP = new TestSetup([
  DisposableTestSetup,
  EventTestSetup,
]);

let initialized = false;

export default {
  setup(): void {
    if (!initialized) {
      TEST_SETUP.setup();
      initialized = true;
    }
  },
};
