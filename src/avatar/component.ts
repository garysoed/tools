import { Avatar } from '../avatar';
import { ComponentSpec } from '../avatar/component-spec';
import { BaseDisposable } from '../dispose';

export function component<T extends keyof HTMLElementTagNameMap>(
    spec: ComponentSpec<T>): ClassDecorator {
  return (target: Function) => {
    Avatar.define(target as (typeof BaseDisposable), spec);
  };
}
