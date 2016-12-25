import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Arrays} from './arrays';
import SortedSet from './sorted-set';


describe('collection.SortedSet', () => {
  let sortedSet: SortedSet<number>;

  beforeEach(() => {
    sortedSet = new SortedSet<number>();
  });

  describe('Symbol.iterator', () => {
    it('should return the correct iterator', () => {
      sortedSet.push(1);
      sortedSet.push(2);

      assert(Arrays.fromIterable(sortedSet).asArray()).to.equal([1, 2]);
    });
  });

  describe('getAt', () => {
    it('should return the correct element', () => {
      sortedSet.push(1);
      sortedSet.push(2);

      assert(sortedSet.getAt(1)).to.equal(2);
    });
  });

  describe('insertAt', () => {
    it('should insert the element', () => {
      sortedSet.push(1);
      sortedSet.push(2);
      sortedSet.insertAt(3, 1);
      assert(Arrays.fromIterable(sortedSet).asArray()).to.equal([1, 3, 2]);
    });

    it('should remove the old element and moves it to the new position', () => {
      sortedSet.push(1);
      sortedSet.push(2);
      sortedSet.insertAt(1, 2);
      assert(Arrays.fromIterable(sortedSet).asArray()).to.equal([2, 1]);
    });
  });

  describe('push', () => {
    it('should insert the element at the end of the set', () => {
      sortedSet.push(1);
      sortedSet.push(2);

      assert(Arrays.fromIterable(sortedSet).asArray()).to.equal([1, 2]);
    });
  });

  describe('remove', () => {
    it('should remove the element from the set', () => {
      sortedSet.push(1);
      sortedSet.push(2);
      sortedSet.push(3);
      sortedSet.remove(2);
      assert(Arrays.fromIterable(sortedSet).asArray()).to.equal([1, 3]);
    });

    it('should do nothing if the element does not exist', () => {
      sortedSet.push(1);
      sortedSet.push(2);
      sortedSet.push(3);
      sortedSet.remove(4);
      assert(Arrays.fromIterable(sortedSet).asArray()).to.equal([1, 2, 3]);
    });
  });

  describe('size', () => {
    it('should return the correct size', () => {
      sortedSet.push(1);
      sortedSet.push(2);

      assert(sortedSet.getSize()).to.equal(2);
    });
  });
});
