import { assert, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { TreeSet } from '../immutable';

type JsonTree = {children: JsonTree[], value: number};

function treeToJson(treeSet: TreeSet<number>): JsonTree {
  const childrenJson = [];
  for (const child of treeSet.getChildren()) {
    childrenJson.push(treeToJson(treeSet.getChildNode(child)!));
  }

  return {value: treeSet.getValue(), children: childrenJson};
}

describe('immutable.TreeSet', () => {
  let root: TreeSet<number>;

  beforeEach(() => {
    root = TreeSet.of<number>(2)
        .add(TreeSet.of(1))
        .add(TreeSet.of<number>(5)
            .add(TreeSet.of(3))
            .add(TreeSet.of(4)));
  });

  describe('add', () => {
    should(`add the node correctly`, () => {
      assert(treeToJson(root.add(TreeSet.of(6)))).to.equal({
        children: [
          {children: [], value: 1},
          {
            children: [
              {children: [], value: 3},
              {children: [], value: 4},
            ],
            value: 5,
          },
          {children: [], value: 6},
        ],
        value: 2,
      });
    });
  });

  describe('delete', () => {
    should(`delete the node correctly`, () => {
      assert(treeToJson(root.delete(5))).to.equal({
        children: [
          {children: [], value: 1},
        ],
        value: 2,
      });
    });
  });

  describe('getChildNode', () => {
    should(`return the correct child node`, () => {
      assert(treeToJson(root.getChildNode(1)!)).to.equal({
        children: [],
        value: 1,
      });
    });

    should(`return null if the key doesn't exist`, () => {
      assert(root.getChildNode(3)).to.beNull();
    });
  });

  describe('getChildren', () => {
    should(`return the correct children values`, () => {
      assert(root.getChildren()).to.haveElements([1, 5]);
    });
  });

  describe('map', () => {
    should(`map the tree correctly`, () => {
      const newTree = root.map((node, parent) => {
        const parentValue = parent ? parent.getValue() : 0;
        return node.getValue() + parentValue;
      });

      assert(treeToJson(newTree)).to.equal({
        children: [
          {children: [], value: 3},
          {
            children: [
              {children: [], value: 8},
              {children: [], value: 9},
            ],
            value: 7,
          },
        ],
        value: 2,
      });
    });
  });

  describe('setValue', () => {
    should(`update the value correctly`, () => {
      assert(treeToJson(root.setValue(6))).to.equal({
        children: [
          {children: [], value: 1},
          {
            children: [
              {children: [], value: 3},
              {children: [], value: 4},
            ],
            value: 5,
          },
        ],
        value: 6,
      });
    });
  });
});
