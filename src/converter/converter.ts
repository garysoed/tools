export interface Converter<F, T> {
  convertBackward(value: T|null): F|null;

  convertForward(input: F|null): T|null;
}
