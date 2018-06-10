import { runEnvironment } from 'gs-testing/export/main';
import { TestDispose } from './dispose/testing/test-dispose';
import { PathMatcher } from './path/testing';
import { Log, LogLevel } from './util/log';

let initialized = false;
export const TestBase = {
  setup(): void {
    if (!initialized) {
      runEnvironment([
        PathMatcher.testSetup,
        TestDispose,
      ]);
      Log.setEnabledLevel(LogLevel.OFF);
      initialized = true;
    }
  },
};
