import { assert, match, should } from '@gs-testing';
import { Vector2d } from './vector2d';


describe('immutable.Vector2d', () => {
  describe('add', () => {
    should(`add the vectors correctly`, () => {
      assert(Vector2d.of(1, 2).add(Vector2d.of(3, 4))).to
          .equal(match.anyObjectThat().haveProperties({x: 4, y: 6}));
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
      assert(Vector2d.of(1, 2).mult(3)).to
          .equal(match.anyObjectThat().haveProperties({x: 3, y: 6}));
    });
  });
});
