import { assert, Matchers, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { Vector2d } from '../immutable/vector2d';


describe('immutable.Vector2d', () => {
  describe('add', () => {
    should(`add the vectors correctly`, () => {
      assert(Vector2d.of(1, 2).add(Vector2d.of(3, 4))).to
          .equal(Matchers.objectContaining({x: 4, y: 6}));
    });
  });

  describe('getLength', () => {
    should(`compute the length correctly`, () => {
      assert(Vector2d.of(3, 4).getLength()).to.equal(5);
    });
  });

  describe('getLengthSquared', () => {
    should(`compute length squared correctly`, () => {
      assert(Vector2d.of(3, 4).getLengthSquared()).to.equal(25);
    });
  });

  describe('mult', () => {
    should(`multiply with a constant correctly`, () => {
      assert(Vector2d.of(1, 2).mult(3)).to.equal(Matchers.objectContaining({x: 3, y: 6}));
    });
  });
});
