export interface Ctor<TYPE, ARGS extends readonly any[]> {
  new (...args: ARGS): TYPE;
}
