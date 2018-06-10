import { TestBase } from '../test-base';
TestBase.setup();

import { assert } from 'gs-testing/export/main';
import { Mocks } from 'gs-testing/export/mock';
import { TreeMap } from '../immutable';
import { ImmutableSet } from '../immutable/immutable-set';
import { forFiniteCollection, forTreeMap, withRetry } from './promises';


describe('async.Promises', () => {
  describe('forFiniteCollection', () => {
    it(`should transform the collection correctly`, async () => {
      const value1 = Mocks.object('value1');
      const value2 = Mocks.object('value2');
      const promise1 = Promise.resolve(value1);
      const promise2 = Promise.resolve(value2);
      assert(await forFiniteCollection(ImmutableSet.of([promise1, promise2])))
          .to.haveElements([value1, value2]);
    });
  });

  describe('forTreeMap', () => {
    /**
     * Test interface.
     */
    interface JsonString {
      [key: string]: JsonString;
    }

    /**
     * Converts the given tree to JSON.
     *
     * @param treeMap Tree to convert.
     * @return JSON representation of the given tree.
     */
    function treeToJson(treeMap: TreeMap<string, number>): JsonString {
      const childrenJson: any = {};
      const children = treeMap.getKeys().mapItem(key => {
        return [key, treeMap.getChildNode(key)] as [string, TreeMap<string, number>];
      });
      for (const [key, node] of children) {
        childrenJson[key] = treeToJson(node);
      }

      return {[`${treeMap.getValue()}`]: childrenJson};
    }

    it(`should resolve the values correctly`, async () => {
      const promiseTree = TreeMap.of<string, Promise<number>>(Promise.resolve(2))
          .set('a', TreeMap.of(Promise.resolve(1)))
          .set(
              'b',
              TreeMap.of<string, Promise<number>>(Promise.resolve(5))
                  .set('c', TreeMap.of(Promise.resolve(3)))
                  .set('d', TreeMap.of(Promise.resolve(4))));
      assert(treeToJson(await forTreeMap(promiseTree))).to.equal({
        2: {
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

  describe('withRetry', () => {
    it(`should retry correctly`, async () => {
      let retryCount = 0;
      const value = 'value';
      const mockCallback = jasmine.createSpy('Callback');
      mockCallback.and.callFake(() => {
        if (retryCount === 0) {
          throw new Error('expected error');
        }

        return value;
      });

      const mockRetryStrategy = jasmine.createSpyObj('RetryStrategy', ['onReject']);
      mockRetryStrategy.onReject.and.callFake(async () => {
        if (retryCount === 0) {
          retryCount++;

          return mockRetryStrategy;
        }

        return null;
      });

      assert(await withRetry(mockCallback, mockRetryStrategy)).to.equal(value);
      assert(retryCount).to.equal(1);
    });

    it(`should reject if the last retry does not succeed`, async () => {
      let retryCount = 0;
      const mockCallback = jasmine.createSpy('Callback');
      const errorMsg = 'errorMsg';
      mockCallback.and.throwError(errorMsg);

      const mockRetryStrategy = jasmine.createSpyObj('RetryStrategy', ['onReject']);
      mockRetryStrategy.onReject.and.callFake(async () => {
        if (retryCount === 0) {
          retryCount++;

          return mockRetryStrategy;
        }

        return null;
      });

      await assert(withRetry(mockCallback, mockRetryStrategy)).to
          .rejectWithError(new RegExp(errorMsg));
      assert(retryCount).to.equal(1);
    });
  });
});
