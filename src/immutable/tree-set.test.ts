// import { assert, match, should, test } from '@gs-testing';
// import { TreeSet } from '.';

// interface JsonTree {
//   children: JsonTree[];
//   value: number;
// }

// function treeToJson(treeSet: TreeSet<number>): JsonTree {
//   const childrenJson = [];
//   for (const child of treeSet.getChildren()) {
//     // tslint:disable-next-line:no-non-null-assertion
//     childrenJson.push(treeToJson(treeSet.getChildNode(child)!));
//   }

//   return {value: treeSet.getValue(), children: childrenJson};
// }

// test('immutable.TreeSet', () => {
//   let root: TreeSet<number>;

//   beforeEach(() => {
//     root = TreeSet.of<number>(2)
//         .add(TreeSet.of(1))
//         .add(TreeSet.of<number>(5)
//             .add(TreeSet.of(3))
//             .add(TreeSet.of(4)));
//   });

//   test('add', () => {
//     should(`add the node correctly`, () => {
//       assert(treeToJson(root.add(TreeSet.of(6)))).to.haveProperties({
//         children: match.anyArrayThat().haveExactElements([
//           match.anyObjectThat().haveProperties({
//             children: match.anyArrayThat().haveExactElements([]),
//             value: 1,
//           }),
//           match.anyObjectThat().haveProperties({
//             children: match.anyArrayThat().haveExactElements([
//               match.anyObjectThat().haveProperties({
//                 children: match.anyArrayThat().haveExactElements([]),
//                 value: 3,
//               }),
//               match.anyObjectThat().haveProperties({
//                 children: match.anyArrayThat().haveExactElements([]),
//                 value: 4,
//               }),
//             ]),
//             value: 5,
//           }),
//           match.anyObjectThat().haveProperties({
//             children: match.anyArrayThat().haveExactElements([]),
//             value: 6,
//           }),
//         ]),
//         value: 2,
//       });
//     });
//   });

//   test('delete', () => {
//     should(`delete the node correctly`, () => {
//       assert(treeToJson(root.delete(5))).to.haveProperties({
//         children: match.anyArrayThat().haveExactElements([
//           match.anyObjectThat().haveProperties({
//             children: match.anyArrayThat().haveExactElements([]),
//             value: 1,
//           }),
//         ]),
//         value: 2,
//       });
//     });
//   });

//   test('getChildNode', () => {
//     should(`return the correct child node`, () => {
//       // tslint:disable-next-line:no-non-null-assertion
//       assert(treeToJson(root.getChildNode(1)!)).to.haveProperties({
//         children: match.anyArrayThat().haveExactElements([]),
//         value: 1,
//       });
//     });

//     should(`return null if the key doesn't exist`, () => {
//       assert(root.getChildNode(3)).to.beNull();
//     });
//   });

//   test('getChildren', () => {
//     should(`return the correct children values`, () => {
//       assert(root.getChildren()).to.haveElements([1, 5]);
//     });
//   });

//   test('map', () => {
//     should(`map the tree correctly`, () => {
//       const newTree = root.map((node, parent) => {
//         const parentValue = parent ? parent.getValue() : 0;

//         return node.getValue() + parentValue;
//       });

//       assert(treeToJson(newTree)).to.haveProperties({
//         children: match.anyArrayThat().haveExactElements([
//           match.anyObjectThat().haveProperties({
//             children: match.anyArrayThat().haveExactElements([]),
//             value: 3,
//           }),
//           match.anyObjectThat().haveProperties({
//             children: match.anyArrayThat().haveExactElements([
//               match.anyObjectThat().haveProperties({
//                 children: match.anyArrayThat().haveExactElements([]),
//                 value: 8,
//               }),
//               match.anyObjectThat().haveProperties({
//                 children: match.anyArrayThat().haveExactElements([]),
//                 value: 9,
//               }),
//             ]),
//             value: 7,
//           }),
//         ]),
//         value: 2,
//       });
//     });
//   });

//   test('setValue', () => {
//     should(`update the value correctly`, () => {
//       assert(treeToJson(root.setValue(6))).to.haveProperties({
//         children: match.anyArrayThat().haveExactElements([
//           match.anyObjectThat().haveProperties({
//             children: match.anyArrayThat().haveExactElements([]),
//             value: 1,
//           }),
//           match.anyObjectThat().haveProperties({
//             children: match.anyArrayThat().haveExactElements([
//               match.anyObjectThat().haveProperties({
//                 children: match.anyArrayThat().haveExactElements([]),
//                 value: 3,
//               }),
//               match.anyObjectThat().haveProperties({
//                 children: match.anyArrayThat().haveExactElements([]),
//                 value: 4,
//               }),
//             ]),
//             value: 5,
//           }),
//         ]),
//         value: 6,
//       });
//     });
//   });
// });
