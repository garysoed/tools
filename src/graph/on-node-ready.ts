import { MonadUtil } from '../event';
import { ON_ANNOTATIONS } from '../event/on';
import { Graph } from '../graph/graph';
import { GraphEvent } from '../graph/graph-event';
import { InstanceId } from '../graph/instance-id';

export function onNodeReady<T, C>(
    instanceId: InstanceId<T>, useCapture: boolean = false): MethodDecorator {
  return (target: Object, propertyKey: string | symbol, descriptor: PropertyDecorator) => {
    ON_ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
        propertyKey,
        {
          busProvider: () => Graph,
          handler(event: GraphEvent<T, C>, instance: C): void {
            if (event.id === instanceId && event.context === instance) {
              MonadUtil.callFunction(event, instance, propertyKey);
            }
          },
          type: 'ready',
          useCapture,
        },
    );
    return descriptor;
  };
}
