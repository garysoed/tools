import { PathMatcher } from './path/testing';
import { TestDispose, TestEvent, TestSetup } from './testing';
import { Log, LogLevel } from './util/log';

const TEST_SETUP = new TestSetup([
  PathMatcher.testSetup,
  TestDispose,
  TestEvent,
]);

let initialized = false;
export const TestBase = {
  setup(): void {
    if (!initialized) {
      TEST_SETUP.setup();
      Log.setEnabledLevel(LogLevel.OFF);
      initialized = true;
    }
  },
};
