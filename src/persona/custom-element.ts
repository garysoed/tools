import { BaseDisposable } from '../dispose';

export interface CustomElement {
  connectedCallback(): void;

  disconnectedCallback(): void;

  getCtrl(): BaseDisposable | null;
}
