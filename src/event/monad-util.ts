import { Generators } from '../immutable/generators';
import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Iterables } from '../immutable/iterables';
import { Event } from '../interfaces/event';
import { Monad as MonadType } from '../interfaces/monad';
import { MonadFactory } from '../interfaces/monad-factory';

export class MonadUtil {
  static async callFunction(
      monadData: ImmutableSet<{factory: MonadFactory<any>, index: number}>,
      eventIndexes: ImmutableSet<number>,
      event: Event<any>,
      fn: (...args: any[]) => any,
      context: any): Promise<void> {
    const monadDataMap = ImmutableMap
        .of(monadData
            .mapItem(({index, factory}: {factory: MonadFactory<any>, index: number}) => {
              return [index, [factory, factory(context)]] as
                  [number, [MonadFactory<any>, MonadType<any>]];
            }));

    const args = ImmutableList
        .of(Iterables.unsafeToArray(Generators.ranged(0, 1, fn.length)))
        .map((index: number) => {
          if (eventIndexes.has(index)) {
            return event;
          }
          const data = monadDataMap.get(index);
          if (!data) {
            throw new Error(`No factories found for ${index}`);
          }

          const [factory, monad] = data;
          return monad.get();
        })
        .toArray();

    const rv = fn.apply(context, args);
    const monadMap = ImmutableMap.of(monadDataMap.values());
    if (rv instanceof ImmutableMap) {
      MonadUtil.updateMonads(monadMap, rv);
    } else if (rv instanceof Promise) {
      await rv.then((resolveValue: any) => {
        if (resolveValue instanceof ImmutableMap) {
          MonadUtil.updateMonads(monadMap, resolveValue);
        }
      });
    }
  }

  static updateMonads(
      monadMap: ImmutableMap<MonadFactory<any>, MonadType<any>>,
      newValues: ImmutableMap<MonadFactory<any>, any>): void  {
    for (const [factory, value] of newValues) {
      const monad = monadMap.get(factory);
      if (!monad) {
        throw new Error(`No monads found for value: ${value}`);
      }

      monad.set(value);
    }
  }
}
