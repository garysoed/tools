export class HttpError extends Error {
  readonly name: string;
  readonly stack: string | undefined;

  constructor(
      readonly request: XMLHttpRequest,
      message: string) {
    super(message);
    this.name = 'HttpError';
    this.stack = (new Error()).stack;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
// TODO: Mutable
