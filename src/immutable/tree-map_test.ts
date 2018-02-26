import { assert, TestBase } from '../test-base';
TestBase.setup();

import { TreeMap } from '../immutable';

type JsonString = {[key: string]: JsonString};

function treeToJson(treeMap: TreeMap<string, number>): JsonString {
  const childrenJson = {};
  const children = treeMap.getKeys().mapItem((key) => {
    return [key, treeMap.getChildNode(key)] as [string, TreeMap<string, number>];
  });
  for (const [key, node] of children) {
    childrenJson[key] = treeToJson(node);
  }

  return {[`${treeMap.getValue()}`]: childrenJson};
}

describe('immutable.TreeMap', () => {
  let root: TreeMap<string, number>;

  beforeEach(() => {
    root = TreeMap.of<string, number>(2)
        .set('a', TreeMap.of(1))
        .set(
            'b',
            TreeMap.of<string, number>(5)
                .set('c', TreeMap.of(3))
                .set('d', TreeMap.of(4)));
  });

  describe('delete', () => {
    it(`should delete the node correctly`, () => {
      assert(treeToJson(root.delete('b'))).to.equal({
        '2': {
          'a': {
            '1': {},
          },
        },
      });
    });
  });

  describe('getChildNode', () => {
    it(`should return the correct child node`, () => {
      assert(treeToJson(root.getChildNode('a')!)).to.equal({
        '1': {},
      });
    });

    it(`should return null if the key doesn't exist`, () => {
      assert(root.getChildNode('c')).to.beNull();
    });
  });

  describe('getChildren', () => {
    it(`should return the correct children values`, () => {
      assert(root.getChildren()).to.haveElements([1, 5]);
    });
  });

  describe('set', () => {
    it(`should set the node correctly`, () => {
      assert(treeToJson(root.set('a', TreeMap.of(6)))).to.equal({
        '2': {
          'a': {
            '6': {},
          },
          'b': {
            '5': {
              'c': {
                '3': {},
              },
              'd': {
                '4': {},
              },
            },
          },
        },
      });
    });
  });

  describe('setValue', () => {
    it(`should update the value correctly`, () => {
      assert(treeToJson(root.setValue(6))).to.equal({
        '6': {
          'a': {
            '1': {},
          },
          'b': {
            '5': {
              'c': {
                '3': {},
              },
              'd': {
                '4': {},
              },
            },
          },
        },
      });
    });
  });
});
