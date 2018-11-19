import { assert, should } from 'gs-testing/export/main';
import { TreeMap } from '../immutable';

interface JsonString {
  [key: string]: JsonString;
}

function treeToJson(treeMap: TreeMap<string, number>): JsonString {
  const childrenJson = {};
  const children = treeMap.getKeys().mapItem(key => {
    return [key, treeMap.getChildNode(key)] as [string, TreeMap<string, number>];
  });
  for (const [key, node] of children) {
    // TODO: Remove typecast
    (childrenJson as any)[key] = treeToJson(node);
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
    should(`delete the node correctly`, () => {
      assert(treeToJson(root.delete('b'))).to.equal({
        2: {
          a: {
            1: {},
          },
        },
      });
    });
  });

  describe('getChildNode', () => {
    should(`return the correct child node`, () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(treeToJson(root.getChildNode('a')!)).to.equal({
        1: {},
      });
    });

    should(`return null if the key doesn't exist`, () => {
      assert(root.getChildNode('c')).to.beNull();
    });
  });

  describe('getChildren', () => {
    should(`return the correct children values`, () => {
      assert(root.getChildren()).to.haveElements([1, 5]);
    });
  });

  describe('map', () => {
    should(`map correctly`, () => {
      const newTree = root.map((node, key, parent) => {
        const parentValue = parent ? parent.getValue() : 0;
        return [`new${key}`, node.getValue() + parentValue] as [string, number];
      });
      assert(treeToJson(newTree)).to.equal({
        2: {
          newa: {
            3: {},
          },
          newb: {
            7: {
              newc: {
                8: {},
              },
              newd: {
                9: {},
              },
            },
          },
        },
      });
    });
  });

  describe('set', () => {
    should(`set the node correctly`, () => {
      assert(treeToJson(root.set('a', TreeMap.of(6)))).to.equal({
        2: {
          a: {
            6: {},
          },
          b: {
            5: {
              c: {
                3: {},
              },
              d: {
                4: {},
              },
            },
          },
        },
      });
    });
  });

  describe('setValue', () => {
    should(`update the value correctly`, () => {
      assert(treeToJson(root.setValue(6))).to.equal({
        6: {
          a: {
            1: {},
          },
          b: {
            5: {
              c: {
                3: {},
              },
              d: {
                4: {},
              },
            },
          },
        },
      });
    });
  });
});
