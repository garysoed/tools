type Operator<F, T> = (from: F) => T;

export function transform<F, T>(
    start: F,
    t0: Operator<F, T>,
): T;
export function transform<F, S0, T>(
    start: F,
    t0: Operator<F, S0>,
    t1: Operator<S0, T>,
): T;
export function transform<F, S0, S1, T>(
    start: F,
    t0: Operator<F, S0>,
    t1: Operator<S0, S1>,
    t2: Operator<S1, T>,
): T;
export function transform<F, S0, S1, S2, T>(
    start: F,
    t0: Operator<F, S0>,
    t1: Operator<S0, S1>,
    t2: Operator<S1, S2>,
    t3: Operator<S2, T>,
): T;
export function transform<F, S0, S1, S2, S3, T>(
    start: F,
    t0: Operator<F, S0>,
    t1: Operator<S0, S1>,
    t2: Operator<S1, S2>,
    t3: Operator<S2, S3>,
    t4: Operator<S2, T>,
): T;
export function transform(
    start: unknown,
    ...transformers: Array<Operator<unknown, unknown>>): unknown;
export function transform(
    start: unknown,
    ...transformers: Array<Operator<unknown, unknown>>): unknown {
  let result = start;
  for (const transformer of transformers) {
    result = transformer(result);
  }

  return result;
}
