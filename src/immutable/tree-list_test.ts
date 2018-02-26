import { assert, TestBase } from '../test-base';
TestBase.setup();

import { TreeList } from '../immutable';


describe('immutable.TreeList', () => {
  let root: TreeList<number>;

  beforeEach(() => {
    root = TreeList.of(2)
        .add(TreeList.of(1))
        .add(
            TreeList.of(5)
                .add(TreeList.of(3))
                .add(TreeList.of(4)));
  });

  describe('add', () => {
    it(`should add the nodes correctly`, () => {
      assert(root.add(TreeList.of(6)).postOrder()).to.haveElements([1, 3, 4, 5, 6, 2]);
    });
  });

  describe('deleteAt', () => {
    it(`should delete the node correctly`, () => {
      assert(root.deleteAt(1).postOrder()).to.haveElements([1, 2]);
    });
  });

  describe('getChildNode', () => {
    it(`should return the correct child node`, () => {
      assert(root.getChildNode(1)!.postOrder()).to.haveElements([3, 4, 5]);
    });

    it(`should return null if the key doesn't exist`, () => {
      assert(root.getChildNode(2)).to.beNull();
    });
  });

  describe('getChildren', () => {
    it(`should return the correct children values`, () => {
      assert(root.getChildren()).to.haveElements([1, 5]);
    });
  });

  describe('postOrder', () => {
    it(`should return the correct traversal`, () => {
      assert(root.postOrder()).to.haveElements([1, 3, 4, 5, 2]);
    });
  });

  describe('preOrder', () => {
    it(`should return the correct traversal`, () => {
      assert(root.preOrder()).to.haveElements([2, 1, 5, 3, 4]);
    });
  });

  describe('set', () => {
    it(`should set the node correctly`, () => {
      assert(root.set(1, TreeList.of(6)).postOrder()).to.haveElements([1, 6, 2]);
    });
  });

  describe('setValue', () => {
    it(`should update the value correctly`, () => {
      assert(root.setValue(6).postOrder()).to.haveElements([1, 3, 4, 5, 6]);
    });
  });
});
