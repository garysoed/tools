type Ctor<T> = {
  prototype: T,
  new (): T,
};
type Ctorize<M> = {[C in keyof M]: Ctor<M[C]>};

export type ComponentSpec<H extends keyof HTMLElementTagNameMap> = {
  dependencies?: Iterable<typeof Object>,
  parent?: {
    class: Ctorize<HTMLElementTagNameMap>[H],
    tag: H,
  },
  tag: string,
  templateKey: string,
};
