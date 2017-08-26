import { BaseDisposable } from '../dispose';
import { Persona } from '../persona';
import { ComponentSpec } from '../persona/component-spec';

export function component<T extends keyof HTMLElementTagNameMap>(
    spec: ComponentSpec<T>): ClassDecorator {
  return (target: Function) => {
    Persona.define(target as (typeof BaseDisposable), spec);
  };
}
