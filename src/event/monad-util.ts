import { ANNOTATIONS as EVENT_ANNOTATIONS } from '../event/event';
import { ANNOTATIONS as MONAD_ANNOTATIONS } from '../event/monad';
import { Generators } from '../immutable/generators';
import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Iterables } from '../immutable/iterables';
import { Event } from '../interfaces/event';
import { Monad as MonadType } from '../interfaces/monad';
import { MonadFactory } from '../interfaces/monad-factory';

type MonadData = {factory: MonadFactory<any>, id: any, index: number};

export class MonadUtil {
  static async callFunction(
      event: Event<any>,
      context: any,
      key: string | symbol): Promise<void> {
    const fn = context[key];
    const {monadData, eventIndexes} = MonadUtil.getMonadData_(context, key);
    const monadDataMap = ImmutableMap
        .of(monadData
            .mapItem(({id, index, factory}: MonadData) => {
              return [index, [factory(context), factory, id, factory]] as
                  [number, [MonadType<any>, MonadFactory<any>, any]];
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

          const [monad] = data;
          return monad.get();
        })
        .toArray();

    const rv = fn.apply(context, args);
    const monadMap = ImmutableMap.of(
        monadDataMap
            .values()
            .mapItem(([monad, factory, id]: [MonadType<any>, MonadFactory<any>, any]) => {
              return [id, monad] as [any, MonadType<any>];
            }));
    if (rv instanceof ImmutableMap) {
      MonadUtil.updateMonads_(monadMap, rv);
    } else if (rv instanceof Promise) {
      await rv.then((resolveValue: any) => {
        if (resolveValue instanceof ImmutableMap) {
          MonadUtil.updateMonads_(monadMap, resolveValue);
        }
      });
    }
  }

  private static getMonadData_(context: any, key: string | symbol):
      {eventIndexes: ImmutableSet<number>, monadData: ImmutableSet<MonadData>} {
    const monadData = MONAD_ANNOTATIONS.forCtor(context.constructor).getAttachedValues().get(key)
        || ImmutableSet.of([]);
    const eventIndexes = EVENT_ANNOTATIONS.forCtor(context.constructor).getAttachedValues().get(key)
        || ImmutableSet.of([]);
    return {monadData, eventIndexes};
  }

  private static updateMonads_(
      monadMap: ImmutableMap<any, MonadType<any>>,
      newValues: ImmutableMap<any, any>): void  {
    for (const [factory, value] of newValues) {
      const monad = monadMap.get(factory);
      if (!monad) {
        throw new Error(`No monads found for value: ${value}`);
      }

      monad.set(value);
    }
  }
}
