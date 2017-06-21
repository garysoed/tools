import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Vector2d } from '../immutable/vector2d';


describe('immutable.Vector2d', () => {
  describe('add', () => {
    it(`should add the vectors correctly`, () => {
      assert(Vector2d.of(1, 2).add(Vector2d.of(3, 4))).to
          .equal(Matchers.objectContaining({x: 4, y: 6}));
    });
  });

  describe('getLength', () => {
    it(`should compute the length correctly`, () => {
      assert(Vector2d.of(3, 4).getLength()).to.equal(5);
    });
  });

  describe('getLengthSquared', () => {
    it(`should compute length squared correctly`, () => {
      assert(Vector2d.of(3, 4).getLengthSquared()).to.equal(25);
    });
  });

  describe('mult', () => {
    it(`should multiply with a constant correctly`, () => {
      assert(Vector2d.of(1, 2).mult(3)).to.equal(Matchers.objectContaining({x: 3, y: 6}));
    });
  });
});
