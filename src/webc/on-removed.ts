import { onLifecycle } from '../webc/on-lifecycle';

export function onRemoved(): MethodDecorator {
  return onLifecycle('remove');
}
