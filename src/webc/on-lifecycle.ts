import { Annotations } from '../data/annotations';

type Lifecycle = 'create' | 'insert' | 'remove';

export const ANNOTATIONS = Annotations.of<Lifecycle>(Symbol('onLifecycle'));

export function onLifecycle(lifecycle: Lifecycle): MethodDecorator {
  return (
      target: Object,
      propertyKey: string | symbol,
      _: PropertyDescriptor) => {
    ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(propertyKey, lifecycle);
  };
}
