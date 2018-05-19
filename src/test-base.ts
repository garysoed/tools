import { TestGraph } from './graph';
import { PathMatcher } from './path/testing';
import { TestDispose, TestEvent, TestJasmine, TestSetup } from './testing';
import { Log, LogLevel } from './util/log';
export { assert, Match } from 'gs-testing/export/main';
export { Fakes } from './mock/fakes';
export { Mocks } from './mock/mocks';

const TEST_SETUP = new TestSetup([
  PathMatcher.testSetup,
  TestDispose,
  TestEvent,
  TestGraph,
  TestJasmine,
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
