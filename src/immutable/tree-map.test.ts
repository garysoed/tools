// import { assert, match, should, test } from 'gs-testing/export/main';
// import { TreeMap } from '.';

// interface JsonString {
//   [key: string]: JsonString;
// }

// function treeToJson(treeMap: TreeMap<string, number>): JsonString {
//   const childrenJson = {};
//   const children = treeMap.getKeys().mapItem(key => {
//     return [key, treeMap.getChildNode(key)] as [string, TreeMap<string, number>];
//   });
//   for (const [key, node] of children) {
//     // TODO: Remove typecast
//     (childrenJson as any)[key] = treeToJson(node);
//   }

//   return {[`${treeMap.getValue()}`]: childrenJson};
// }

// test('immutable.TreeMap', () => {
//   let root: TreeMap<string, number>;

//   beforeEach(() => {
//     root = TreeMap.of<string, number>(2)
//         .set('a', TreeMap.of(1))
//         .set(
//             'b',
//             TreeMap.of<string, number>(5)
//                 .set('c', TreeMap.of(3))
//                 .set('d', TreeMap.of(4)));
//   });

//   test('delete', () => {
//     should(`delete the node correctly`, () => {
//       assert(treeToJson(root.delete('b'))).to.equal(match.anyObjectThat().haveProperties({
//         2: match.anyObjectThat().haveProperties({
//           a: match.anyObjectThat().haveProperties({
//             1: match.anyObjectThat().haveProperties({}),
//           }),
//         }),
//       }));
//     });
//   });

//   test('getChildNode', () => {
//     should(`return the correct child node`, () => {
//       // tslint:disable-next-line:no-non-null-assertion
//       assert(treeToJson(root.getChildNode('a')!)).to.equal(match.anyObjectThat().haveProperties({
//         1: match.anyObjectThat().haveProperties({}),
//       }));
//     });

//     should(`return null if the key doesn't exist`, () => {
//       assert(root.getChildNode('c')).to.beNull();
//     });
//   });

//   test('getChildren', () => {
//     should(`return the correct children values`, () => {
//       assert(root.getChildren()).to.haveElements([1, 5]);
//     });
//   });

//   test('map', () => {
//     should(`map correctly`, () => {
//       const newTree = root.map((node, key, parent) => {
//         const parentValue = parent ? parent.getValue() : 0;

//         return [`new${key}`, node.getValue() + parentValue] as [string, number];
//       });
//       assert(treeToJson(newTree)).to.equal(match.anyObjectThat().haveProperties({
//         2: match.anyObjectThat().haveProperties({
//           newa: match.anyObjectThat().haveProperties({
//             3: match.anyObjectThat().haveProperties({}),
//           }),
//           newb: match.anyObjectThat().haveProperties({
//             7: match.anyObjectThat().haveProperties({
//               newc: match.anyObjectThat().haveProperties({
//                 8: match.anyObjectThat().haveProperties({}),
//               }),
//               newd: match.anyObjectThat().haveProperties({
//                 9: match.anyObjectThat().haveProperties({}),
//               }),
//             }),
//           }),
//         }),
//       }),
//       );
//     });
//   });

//   test('set', () => {
//     should(`set the node correctly`, () => {
//       assert(treeToJson(root.set('a', TreeMap.of(6)))).to.equal(
//           match.anyObjectThat().haveProperties({
//             2: match.anyObjectThat().haveProperties({
//               a: match.anyObjectThat().haveProperties({
//                 6: match.anyObjectThat().haveProperties({}),
//               }),
//               b: match.anyObjectThat().haveProperties({
//                 5: match.anyObjectThat().haveProperties({
//                   c: match.anyObjectThat().haveProperties({
//                     3: match.anyObjectThat().haveProperties({}),
//                   }),
//                   d: match.anyObjectThat().haveProperties({
//                     4: match.anyObjectThat().haveProperties({}),
//                   }),
//                 }),
//               }),
//             }),
//           }),
//       );
//     });
//   });

//   test('setValue', () => {
//     should(`update the value correctly`, () => {
//       assert(treeToJson(root.setValue(6))).to.equal(match.anyObjectThat().haveProperties({
//         6: match.anyObjectThat().haveProperties({
//           a: match.anyObjectThat().haveProperties({
//             1: match.anyObjectThat().haveProperties({}),
//           }),
//           b: match.anyObjectThat().haveProperties({
//             5: match.anyObjectThat().haveProperties({
//               c: match.anyObjectThat().haveProperties({
//                 3: match.anyObjectThat().haveProperties({}),
//               }),
//               d: match.anyObjectThat().haveProperties({
//                 4: match.anyObjectThat().haveProperties({}),
//               }),
//             }),
//           }),
//         }),
//       }),
//       );
//     });
//   });
// });
