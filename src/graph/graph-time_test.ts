import { assert, TestBase } from '../test-base';
TestBase.setup();

import { GraphTime } from '../graph';


describe('graph.GraphTime', () => {
  describe('beforeOrEqualTo', () => {
    it(`should return true if the first time is before the second one`, () => {
      const time1 = GraphTime.new();
      const time2 = GraphTime.new().increment();

      assert(time1.beforeOrEqualTo(time2)).to.beTrue();
    });

    it(`should return true if the two times are equal`, () => {
      const time = GraphTime.new();

      assert(time.beforeOrEqualTo(time)).to.beTrue();
    });

    it(`should return false if the first time is after the second one`, () => {
      const time1 = GraphTime.new();
      const time2 = GraphTime.new().increment();

      assert(time2.beforeOrEqualTo(time1)).to.beFalse();
    });
  });
});
