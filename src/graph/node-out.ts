import { Graph } from '../graph';
import { InstanceId } from '../graph/instance-id';
import { NodeId } from '../graph/node-id';
import { ANNOTATIONS } from '../graph/node-in';

export function nodeOut(instanceId: InstanceId<any>, isEager: boolean = false): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const paramsSet = ANNOTATIONS
        .forCtor(target.constructor)
        .getAttachedValues()
        .get(propertyKey);

    const paramsArray: NodeId<any>[] = [];
    for (const {index, instanceId} of paramsSet || []) {
      paramsArray[index] = instanceId;
    }

    Graph.registerGenericProvider_(
        instanceId,
        isEager,
        target[propertyKey] as any,
        ...paramsArray);
  };
}
