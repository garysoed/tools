import { onLifecycle } from '../webc/on-lifecycle';

export function onInserted(): MethodDecorator {
  return onLifecycle('insert');
}
