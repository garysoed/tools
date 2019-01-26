import { Stream } from './types/stream';

type Operator<F, T> = (from: F) => T;

export function exec<F, T>(
    start: F,
    t0: Operator<F, T>,
): T;
export function exec<F extends Stream<any, any>, S0, T>(
    start: F,
    t0: Operator<F, S0>,
    t1: Operator<S0, T>,
): T;
export function exec<F extends Stream<any, any>, S0, S1, T>(
    start: F,
    t0: Operator<F, S0>,
    t1: Operator<S0, S1>,
    t2: Operator<S1, T>,
): T;
export function exec<F extends Stream<any, any>, S0, S1, S2, T>(
    start: F,
    t0: Operator<F, S0>,
    t1: Operator<S0, S1>,
    t2: Operator<S1, S2>,
    t3: Operator<S2, T>,
): T;
export function exec<F extends Stream<any, any>, S0, S1, S2, S3, T>(
    start: F,
    t0: Operator<F, S0>,
    t1: Operator<S0, S1>,
    t2: Operator<S1, S2>,
    t3: Operator<S2, S3>,
    t4: Operator<S3, T>,
): T;
export function exec<F extends Stream<any, any>, S0, S1, S2, S3, S4, T>(
    start: F,
    t0: Operator<F, S0>,
    t1: Operator<S0, S1>,
    t2: Operator<S1, S2>,
    t3: Operator<S2, S3>,
    t4: Operator<S3, S4>,
    t5: Operator<S4, T>,
): T;
export function exec<F extends Stream<any, any>, S0, S1, S2, S3, S4, S5, T>(
    start: F,
    t0: Operator<F, S0>,
    t1: Operator<S0, S1>,
    t2: Operator<S1, S2>,
    t3: Operator<S2, S3>,
    t4: Operator<S3, S4>,
    t5: Operator<S4, S5>,
    t6: Operator<S5, T>,
): T;
export function exec<F extends Stream<any, any>, S0, S1, S2, S3, S4, S5, S6, T>(
    start: F,
    t0: Operator<F, S0>,
    t1: Operator<S0, S1>,
    t2: Operator<S1, S2>,
    t3: Operator<S2, S3>,
    t4: Operator<S3, S4>,
    t5: Operator<S4, S5>,
    t6: Operator<S5, S6>,
    t7: Operator<S6, T>,
): T;
export function exec<F extends Stream<any, any>, S0, S1, S2, S3, S4, S5, S6, S7, T>(
    start: F,
    t0: Operator<F, S0>,
    t1: Operator<S0, S1>,
    t2: Operator<S1, S2>,
    t3: Operator<S2, S3>,
    t4: Operator<S3, S4>,
    t5: Operator<S4, S5>,
    t6: Operator<S5, S6>,
    t7: Operator<S6, S7>,
    t8: Operator<S7, T>,
): T;
export function exec<F extends Stream<any, any>, S0, S1, S2, S3, S4, S5, S6, S7, S8, T>(
    start: F,
    t0: Operator<F, S0>,
    t1: Operator<S0, S1>,
    t2: Operator<S1, S2>,
    t3: Operator<S2, S3>,
    t4: Operator<S3, S4>,
    t5: Operator<S4, S5>,
    t6: Operator<S5, S6>,
    t7: Operator<S6, S7>,
    t8: Operator<S7, S8>,
    t9: Operator<S8, T>,
): T;
export function exec(
    start: Stream<any, any>,
    ...transformers: Array<Operator<unknown, unknown>>): unknown;
export function exec(
    start: Stream<any, any>,
    ...transformers: Array<Operator<unknown, unknown>>): unknown {
  let result: unknown = start;
  for (const transformer of transformers) {
    result = transformer(result);
  }

  return result;
}
