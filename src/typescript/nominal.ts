const __subtype = Symbol('subtype');

export type Nominal<B, S> = B & {
  readonly [__subtype]: S;
};

export function makeTypeFactory<
  T extends Nominal<unknown, unknown> = never,
>(): (target: unknown) => T {
  return (target: unknown) => target as T;
}
