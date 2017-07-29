import { IterableType } from '../check';
import { ANNOTATIONS as EVENT_ANNOTATIONS } from '../event/event-details';
import { ANNOTATIONS as MONAD_ANNOTATIONS } from '../event/monad';
import { Generators, ImmutableList, ImmutableMap, ImmutableSet } from '../immutable';
import { Event, Monad as MonadType, MonadFactory, MonadSetter, MonadValue } from '../interfaces';
import { Log } from '../util';

const LOGGER: Log = Log.of('gs-tools.event.MonadUtil');

type MonadData = {factory: MonadFactory<any>, index: number, setter: boolean};

class MonadSetterImpl<T> implements MonadSetter<T> {
  constructor(private readonly id_: number, readonly value: T) { }

  set(newValue: T): MonadValue<T> {
    return {id: this.id_, value: newValue};
  }
}

export class MonadUtil {
  static async callFunction<E extends Event<any>>(
      event: E,
      context: any,
      key: string | symbol): Promise<void> {
    Log.debug(LOGGER, `Calling function ${key}`);
    let id = 0;
    const fn = context[key];
    const {monadData, eventIndexes} = MonadUtil.getMonadData_(context, key);
    const monadDataMap = ImmutableMap
        .of(monadData
            .mapItem(({index, factory, setter}: MonadData) => {
              id++;
              return [index, [factory(context), factory, id, setter]] as
                  [number, [MonadType<any>, MonadFactory<any>, number, boolean]];
            }));

    const args = ImmutableList
        .of([...Generators.ranged(0, 1, fn.length)])
        .map((index: number) => {
          if (eventIndexes.has(index)) {
            return event;
          }
          const data = monadDataMap.get(index);
          if (!data) {
            throw new Error(`No factories found for ${index} while trying to call ${key}`);
          }

          const [monad, , id, setter] = data;
          const value = monad.get();
          return setter ? new MonadSetterImpl(id, value) : value;
        })
        .toArray();

    const rv = fn.apply(context, args);
    const monadMap = ImmutableMap.of(
        monadDataMap
            .values()
            .mapItem(([monad, _, id]: [MonadType<any>, MonadFactory<any>, any]) => {
              return [id, monad] as [any, MonadType<any>];
            }));
    if (IterableType.check(rv)) {
      MonadUtil.updateMonads_(monadMap, rv);
    } else if (rv instanceof Promise) {
      await rv.then((resolveValue: any) => {
        if (IterableType.check(resolveValue)) {
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
      newValues: Iterable<MonadValue<any>>): void  {
    for (const {id, value} of newValues) {
      const monad = monadMap.get(id);
      if (!monad) {
        throw new Error(`No monads found for value: ${value}`);
      }

      monad.set(value);
    }
  }
}
