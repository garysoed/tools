import {asRandom, combineRandom, Random} from '../random';

interface State {
  readonly generatedIds: ReadonlySet<string>;
  readonly nextSuffix: number;
}

export function withConflictResolution(randomId: Random<string>): Random<string> {
  const generatedIds = asRandom<State>({
    generatedIds: new Set(),
    nextSuffix: 0,
  });
  return combineRandom(randomId, generatedIds)
      .take(([value, state]) => {
        if (state.generatedIds.has(value)) {
          const newValue = `value-${state.nextSuffix}`;
          return asRandom([
            newValue,
            {
              generatedIds: new Set([...state.generatedIds, newValue]),
              nextSuffix: state.nextSuffix + 1,
            },
          ] as const);
        }

        return asRandom([
          value,
          {
            generatedIds: new Set([...state.generatedIds, value]),
            nextSuffix: state.nextSuffix,
          },
        ] as const);
      })
      .take(([value]) => asRandom(value));
}