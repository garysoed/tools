// import { assert, should } from 'gs-testing/export/main';
// import { mocks } from 'gs-testing/export/mock';
// import { NumberType } from 'gs-types/export';
// import { ImmutableList } from './immutable-list';
// import { ImmutableSet } from './immutable-set';
// import { Orderings } from './orderings';


// describe('immutable.ImmutableList', () => {
//   describe('[Symbol.iterator]', () => {
//     should('return the correct data', () => {
//       assert(ImmutableList.of([1, 2, 3, 4])).to.haveElements([1, 2, 3, 4]);
//     });
//   });

//   describe('add', () => {
//     should('add the item correctly', () => {
//       assert(ImmutableList.of([1, 2, 3, 4]).add(5)).to.haveElements([1, 2, 3, 4, 5]);
//     });
//   });

//   describe('addAll', () => {
//     should('add all the items correctly', () => {
//       const list = ImmutableList.of([1, 2, 3, 4]).addAll(ImmutableSet.of([5, 6]));
//       assert(list).to.haveElements([1, 2, 3, 4, 5, 6]);
//     });
//   });

//   describe('delete', () => {
//     should('delete the item correctly', () => {
//       assert(ImmutableList.of([1, 2, 3, 4]).delete(2)).to.haveElements([1, 3, 4]);
//     });

//     should('do nothing if the item cannot be found', () => {
//       assert(ImmutableList.of([1, 2, 3, 4]).delete(5)).to.haveElements([1, 2, 3, 4]);
//     });
//   });

//   describe('deleteAll', () => {
//     should('delete all the items correctly', () => {
//       const list = ImmutableList.of([1, 2, 3, 4]).deleteAll(ImmutableSet.of([2, 3]));
//       assert(list).to.haveElements([1, 4]);
//     });
//   });

//   describe('deleteAllKeys', () => {
//     should('delete all the items correctly', () => {
//       const list = ImmutableList.of([1, 2, 3, 4]).deleteAllKeys(ImmutableSet.of([1, 2]));
//       assert(list).to.haveElements([1, 4]);
//     });
//   });

//   describe('deleteAt', () => {
//     should('delete the item correctly', () => {
//       assert(ImmutableList.of([1, 2, 3, 4]).deleteAt(1)).to.haveElements([1, 3, 4]);
//     });

//     should('do nothing if the item cannot be found', () => {
//       assert(ImmutableList.of([1, 2, 3, 4]).deleteAt(5)).to.haveElements([1, 2, 3, 4]);
//     });
//   });

//   describe('deleteKey', () => {
//     should('delete the item correctly', () => {
//       assert(ImmutableList.of([1, 2, 3, 4]).deleteKey(1)).to.haveElements([1, 3, 4]);
//     });

//     should('do nothing if the item cannot be found', () => {
//       assert(ImmutableList.of([1, 2, 3, 4]).deleteKey(5)).to.haveElements([1, 2, 3, 4]);
//     });
//   });

//   describe('entries', () => {
//     should('return the correct data', () => {
//       assert(ImmutableList.of([1, 2, 3]).entries()).to.haveElements([[0, 1], [1, 2], [2, 3]]);
//     });
//   });

//   describe('equals', () => {
//     should('return true if the other list is the same', () => {
//       assert(ImmutableList.of([1, 2, 3]).equals(ImmutableList.of([1, 2, 3]))).to.beTrue();
//     });

//     should('return false if the sizes are different', () => {
//       assert(ImmutableList.of([1, 2]).equals(ImmutableList.of([1, 2, 3]))).to.beFalse();
//     });

//     should('return false if one of the elements are different', () => {
//       assert(ImmutableList.of([1, 2, 4]).equals(ImmutableList.of([1, 2, 3]))).to.beFalse();
//     });

//     should('return false if the ordering is different', () => {
//       assert(ImmutableList.of([1, 3, 2]).equals(ImmutableList.of([1, 2, 3]))).to.beFalse();
//     });
//   });

//   describe('every', () => {
//     should('return true if every element passes the check', () => {
//       assert(ImmutableList.of([1, 2, 3]).every((i: number) => i > 0)).to.beTrue();
//     });

//     should('return false if one element does not pass the check', () => {
//       assert(ImmutableList.of([1, 2, 3]).every((i: number) => i !== 2)).to.beFalse();
//     });
//   });

//   describe('everyItem', () => {
//     should('return true if every element passes the check', () => {
//       assert(ImmutableList.of([1, 2, 3]).everyItem((i: number) => i > 0)).to.beTrue();
//     });

//     should('return false if one element does not pass the check', () => {
//       assert(ImmutableList.of([1, 2, 3]).everyItem((i: number) => i !== 2)).to.beFalse();
//     });
//   });

//   describe('filter', () => {
//     should('filter the items correctly', () => {
//       const list = ImmutableList.of([1, 2, 3, 4])
//           .filter((item: number) => (item % 2) === 0);
//       assert(list).to.haveElements([2, 4]);
//     });
//   });

//   describe('filterByType', () => {
//     should(`return the correct list`, () => {
//       const list = ImmutableList
//           .of(['a', 1, 'b', 2, 'c', 3])
//           .filterByType(NumberType);

//       assert(list).to.haveElements([1, 2, 3]);
//     });
//   });

//   describe('filterItem', () => {
//     should('filter the items correctly', () => {
//       const list = ImmutableList.of([1, 2, 3, 4])
//           .filterItem((item: number) => (item % 2) === 0);
//       assert(list).to.haveElements([2, 4]);
//     });
//   });

//   describe('find', () => {
//     should('return the first matching item', () => {
//       assert(ImmutableList.of([1, 2, 3]).find((n: number) => n >= 2)).to.equal(2);
//     });

//     should('return null if there are no matches', () => {
//       assert(ImmutableList.of([1, 2, 3]).find(() => false)).to.beNull();
//     });
//   });

//   describe('findEntry', () => {
//     should('return the first matching entry', () => {
//       assert(ImmutableList.of([1, 2, 3]).findEntry((n: number) => n >= 2)).to
//           .haveExactElements([1, 2]);
//     });

//     should('return null if there are no matches', () => {
//       assert(ImmutableList.of([1, 2, 3]).findEntry(() => false)).to.beNull();
//     });
//   });

//   describe('findKey', () => {
//     should('return the first matching key', () => {
//       assert(ImmutableList.of([1, 2, 3]).findKey((n: number) => n >= 2)).to.equal(1);
//     });

//     should('return null if there are no matches', () => {
//       assert(ImmutableList.of([1, 2, 3]).findKey(() => false)).to.beNull();
//     });
//   });

//   describe('findValue', () => {
//     should('return the first matching value', () => {
//       assert(ImmutableList.of([1, 2, 3]).findValue((n: number) => n >= 2)).to.equal(2);
//     });

//     should('return null if there are no matches', () => {
//       assert(ImmutableList.of([1, 2, 3]).findValue(() => false)).to.beNull();
//     });
//   });

//   describe('get', () => {
//     should('return the correct item', () => {
//       const list = ImmutableList.of([1, 2, 3, 4]);
//       assert(list.get(0)).to.equal(1);
//       assert(list.get(1)).to.equal(2);
//       assert(list.get(2)).to.equal(3);
//       assert(list.get(3)).to.equal(4);
//       assert(list.get(-1)).toNot.beDefined();
//       assert(list.get(6)).toNot.beDefined();
//     });
//   });

//   describe('getAt', () => {
//     should('return the correct item', () => {
//       const list = ImmutableList.of([1, 2, 3, 4]);
//       assert(list.getAt(0)).to.equal(1);
//       assert(list.getAt(1)).to.equal(2);
//       assert(list.getAt(2)).to.equal(3);
//       assert(list.getAt(3)).to.equal(4);
//       assert(list.getAt(-1)).to.equal(4);
//       assert(list.getAt(-11)).toNot.beDefined();
//       assert(list.getAt(6)).toNot.beDefined();
//     });
//   });

//   describe('has', () => {
//     should('return true if the item is in the list', () => {
//       assert(ImmutableList.of([1, 2, 3]).has(2)).to.beTrue();
//     });

//     should('return false if the item is not in the list', () => {
//       assert(ImmutableList.of([1, 2, 3]).has(4)).to.beFalse();
//     });
//   });

//   describe('hasKey', () => {
//     should('return true if the item is in the list', () => {
//       assert(ImmutableList.of([1, 2, 3]).hasKey(1)).to.beTrue();
//     });

//     should('return false if the item is not in the list', () => {
//       assert(ImmutableList.of([1, 2, 3]).hasKey(4)).to.beFalse();
//     });
//   });

//   describe('insertAllAt', () => {
//     should('insert the items correctly', () => {
//       const list = ImmutableList.of([1, 2, 3]).insertAllAt(1, ImmutableSet.of([4, 5]));
//       assert(list).to.haveElements([1, 4, 5, 2, 3]);
//     });
//   });

//   describe('insertAt', () => {
//     should('insert the item correctly', () => {
//       const list = ImmutableList.of([1, 2, 3]).insertAt(1, 4);
//       assert(list).to.haveElements([1, 4, 2, 3]);
//     });
//   });

//   describe('keys', () => {
//     should('return the correct keys', () => {
//       assert(ImmutableList.of([1, 4, 2, 3]).keys()).to.haveElements([0, 1, 2, 3]);
//     });
//   });

//   describe('map', () => {
//     should('map the items correctly', () => {
//       const list = ImmutableList
//           .of([1, 2, 3, 4])
//           .map((value: number, index: number) => value + index);
//       assert(list).to.haveElements([1, 3, 5, 7]);
//     });
//   });

//   describe('mapItem', () => {
//     should('map the items correctly', () => {
//       const list = ImmutableList
//           .of([1, 2, 3, 4])
//           .mapItem((index: number) => `${index}`);
//       assert(list).to.haveElements(['1', '2', '3', '4']);
//     });
//   });

//   describe('max', () => {
//     should(`return the correct max item`, () => {
//       assert(ImmutableList.of([0, 2, 4, 3]).max(Orderings.normal())).to.equal(4);
//     });

//     should(`return null if the list is null`, () => {
//       assert(ImmutableList.of<number>([]).max(Orderings.normal())).to.beNull();
//     });
//   });

//   describe('min', () => {
//     should(`return the correct min item`, () => {
//       assert(ImmutableList.of([4, 2, 0, 3]).min(Orderings.normal())).to.equal(0);
//     });

//     should(`return null if the list is null`, () => {
//       assert(ImmutableList.of<number>([]).min(Orderings.normal())).to.beNull();
//     });
//   });

//   describe('reduce', () => {
//     should('return the correct value', () => {
//       const result = ImmutableList
//           .of([1, 2, 3, 4])
//           .reduce((prev: number, index: number, key: number) => index + prev + key, 2);
//       assert(result).to.equal(18);
//     });
//   });

//   describe('reduceItem', () => {
//     should('return the correct value', () => {
//       const result = ImmutableList
//           .of([1, 2, 3, 4])
//           .reduceItem((prev: number, index: number) => index + prev, 2);
//       assert(result).to.equal(12);
//     });
//   });

//   describe('reverse', () => {
//     should('reverse the items', () => {
//       assert(ImmutableList.of([1, 2, 3, 4]).reverse()).to.haveElements([4, 3, 2, 1]);
//     });
//   });

//   describe('set', () => {
//     should('set the item correctly', () => {
//       assert(ImmutableList.of([1, 2, 3, 4]).set(1, 5)).to.haveElements([1, 5, 3, 4]);
//     });
//   });

//   describe('setAt', () => {
//     should('set the item correctly', () => {
//       assert(ImmutableList.of([1, 2, 3, 4]).setAt(1, 5)).to.haveElements([1, 5, 3, 4]);
//     });
//   });

//   describe('size', () => {
//     should('return the correct length', () => {
//       assert(ImmutableList.of([1, 2, 3, 4]).size()).to.equal(4);
//     });
//   });

//   describe('slice', () => {
//     should(`return the correct slice`, () => {
//       const list = ImmutableList.of([1, 2, 3, 4]);

//       assert(list.slice(1, 4)).to.haveElements([2, 3, 4]);
//       assert(list.slice(3, 1)).to.haveElements([]);
//       assert(list.slice(1, -1)).to.haveElements([2, 3]);
//       assert(list.slice(2, -1)).to.haveElements([3]);
//       assert(list.slice(2, -2)).to.haveElements([]);
//       assert(list.slice(0, 4, 2)).to.haveElements([1, 3]);
//       assert(list.slice(undefined, 1, -2)).to.haveElements([4]);
//       assert(list.slice(undefined, undefined, -1)).to.haveElements([4, 3, 2, 1]);
//       assert(list.slice(0, 1, -1)).to.haveElements([]);
//       assert(list.slice(1, 0, 1)).to.haveElements([]);
//     });
//   });

//   describe('some', () => {
//     should('return true if some element passes the check', () => {
//       assert(ImmutableList.of([1, 2, 3]).some((i: number) => i === 2)).to.beTrue();
//     });

//     should('return false if every element does not pass the check', () => {
//       assert(ImmutableList.of([1, 2, 3]).some((i: number) => i < 0)).to.beFalse();
//     });
//   });

//   describe('someItem', () => {
//     should('return true if some element passes the check', () => {
//       assert(ImmutableList.of([1, 2, 3]).someItem((i: number) => i === 2)).to.beTrue();
//     });

//     should('return false if every element does not pass the check', () => {
//       assert(ImmutableList.of([1, 2, 3]).someItem((i: number) => i < 0)).to.beFalse();
//     });
//   });

//   describe('sort', () => {
//     should('sort the items correctly', () => {
//       const list = ImmutableList
//           .of([1, 2, 3, 4])
//           .sort((item1: number, item2: number) => {
//             if (item1 > item2) {
//               return -1;
//             } else if (item2 > item1) {
//               return 1;
//             } else {
//               return 0;
//             }
//           });
//       assert(list).to.haveElements([4, 3, 2, 1]);
//     });
//   });

//   describe('values', () => {
//     should('return the correct data', () => {
//       assert(ImmutableList.of([1, 2, 3, 4]).values()).to.haveElements([1, 2, 3, 4]);
//     });
//   });

//   describe('of', () => {
//     should('create the list correctly from Finite Iterable', () => {
//       const items = [1, 2, 3, 4];
//       assert(ImmutableList.of(ImmutableSet.of(items))).to.haveElements(items);
//     });

//     should('create the list correctly from arrays', () => {
//       const items = [1, 2, 3, 4];
//       assert(ImmutableList.of(items)).to.haveElements(items);
//     });

//     should('create the list correctly from item list', () => {
//       const items = [1, 2, 3, 4];
//       const itemList = {
//         item(index: number): number {
//           return items[index];
//         },
//         length: 4,
//       };
//       assert(ImmutableList.of(itemList)).to.haveElements(items);
//     });

//     should(`create the list correctly from DataTransferItemLists`, () => {
//       const items = [
//         mocks.object<DataTransferItem>('DataTransferItem1'),
//         mocks.object<DataTransferItem>('DataTransferItem2'),
//         mocks.object<DataTransferItem>('DataTransferItem3'),
//         mocks.object<DataTransferItem>('DataTransferItem4'),
//       ];
//       assert(ImmutableList.of(items as any as DataTransferItemList)).to.haveElements(items);
//     });
//   });
// });
