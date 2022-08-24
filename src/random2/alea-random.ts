// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010

import {hasPropertiesType, numberType, Type} from 'gs-types';

import {Random, newRandom} from './random';


interface State {
  readonly c: number;
  readonly s0: number;
  readonly s1: number;
  readonly s2: number;
}
const STATE_TYPE: Type<State> = hasPropertiesType({
  c: numberType,
  s0: numberType,
  s1: numberType,
  s2: numberType,
});

export function aleaRandom(): Random<number> {
  return newRandom(
      seed => {
        const state = STATE_TYPE.check(seed) ? seed : createState(seed);
        const newState = nextState(state);

        return [state.s2, newState];
      },
      seed => {
        const normalizedSeed = STATE_TYPE.check(seed) ? JSON.stringify(seed) : `${seed}-forked`;
        const state = createState(normalizedSeed);

        return nextState(state);
      },
  );
}

function nextState(state: State): State {
  const t = state.s0 * 2091639 + state.c * 2.3283064365386963e-10; // 2^-32
  const newC = t | 0;
  return {
    s0: state.s1,
    s1: state.s2,
    s2: t - newC,
    c: newC,
  };
}

function createState(seed: any): State {
  // Apply the seeding algorithm from Baagoe.
  const masher = new Masher();
  const state = {
    c: 1,
    s0: masher.mash(' '),
    s1: masher.mash(' '),
    s2: masher.mash(' '),
  };

  state.s0 -= masher.mash(seed);
  if (state.s0 < 0) {
    state.s0 += 1;
  }

  state.s1 -= masher.mash(seed);
  if (state.s1 < 0) {
    state.s1 += 1;
  }

  state.s2 -= masher.mash(seed);
  if (state.s2 < 0) {
    state.s2 += 1;
  }

  return state;
}

class Masher {
  private n = 0xEFC8249D;

  mash(data: any): number {
    const strData = String(data);
    for (let i = 0; i < strData.length; i++) {
      this.n += strData.charCodeAt(i);
      let h = this.n * 0.02519603282416938;
      this.n = h >>> 0;
      h -= this.n;
      h *= this.n;
      this.n = h >>> 0;
      h -= this.n;
      this.n += h * 0x100000000; // 2^32
    }
    return (this.n >>> 0) * 2.3283064365386963e-10; // 2^-32
  }
}
