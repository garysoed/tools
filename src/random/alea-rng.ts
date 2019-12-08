// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { Rng } from './rng';

export interface State {
  c: number;
  s0: number;
  s1: number;
  s2: number;
}

export function* aleaRng(seed: number|State): Rng<Readonly<State>> {
  const state = typeof seed === 'number' ? createState(seed) : seed;

  while (true) {
    const t = state.s0 * 2091639 + state.c * 2.3283064365386963e-10; // 2^-32
    state.s0 = state.s1;
    state.s1 = state.s2;
    state.c = t | 0;
    state.s2 = t - state.c;
    yield {state: {...state}, value: state.s2};
  }
}

function createState(seed: number): State {
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
