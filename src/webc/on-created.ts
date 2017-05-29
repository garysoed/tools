import { onLifecycle } from '../webc/on-lifecycle';

export function onCreated(): MethodDecorator {
  return onLifecycle('create');
}
