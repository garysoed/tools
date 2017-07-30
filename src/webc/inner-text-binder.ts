import { DomBinder, Parser } from '../interfaces';

export class InnerTextBinder<T> implements DomBinder<T> {
  constructor(
      private readonly element_: HTMLElement,
      private readonly parser_: Parser<T>) { }

  delete(): void {
    this.element_.innerText = '';
  }

  get(): T | null {
    return this.parser_.parse(this.element_.innerText);
  }

  set(value: T | null): void {
    this.element_.innerText = this.parser_.stringify(value);
  }

  static of<T>(element: HTMLElement, parser: Parser<T>): InnerTextBinder<T> {
    return new InnerTextBinder<T>(element, parser);
  }
}
