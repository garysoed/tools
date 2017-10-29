import { Selector } from '../persona/selector';

type Ctor<T> = {
  prototype: T,
  new (): T,
};
type Ctorize<M> = {[C in keyof M]: Ctor<M[C]>};

export type ComponentSpec<H extends keyof HTMLElementTagNameMap> = {
  defaultAttrs?: Iterable<[string, string]>,
  dependencies?: Iterable<any>,
  inputs?: Iterable<Selector<any>>,
  parent?: {
    class: Ctorize<HTMLElementTagNameMap>[H],
    tag: H,
  },
  tag: string,
  templateKey: string,
};
