import { Graph } from '../graph';
import { InstanceId } from '../graph/instance-id';
import { NodeId } from '../graph/node-id';
import { ANNOTATIONS } from '../graph/node-in';

export function nodeOut(
    instanceId: InstanceId<any>, monitorsChange: boolean = true): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const paramsSet = ANNOTATIONS
        .forCtor(target.constructor)
        .getAttachedValues()
        .get(propertyKey);

    const paramsArray: NodeId<any>[] = [];
    for (const {index, id} of paramsSet || []) {
      paramsArray[index] = id;
    }

    Graph.registerGenericProvider_(
        instanceId,
        monitorsChange,
        target[propertyKey] as any,
        ...paramsArray);
  };
}
