import { BaseDisposable } from '../dispose';
import { NodeId } from '../graph/node-id';
import { ANNOTATIONS } from '../graph/node-in';
import { ImmutableSet } from '../immutable';
import { ChildrenSelector } from '../persona/children-selector';
import { InnerTextSelector } from '../persona/inner-text-selector';
import { Persona } from '../persona/persona';
import { Selector } from '../persona/selector';

function createRenderDecorator<S extends Selector<any>>():
    (selector: S) => MethodDecorator {
  return (selector: S) => {
    return (target: Object, propertyKey: string | symbol) => {
      if (!(target instanceof BaseDisposable)) {
        throw new Error(`${target} is not an instance of BaseDisposable`);
      }

      const nodeIns = ANNOTATIONS
          .forCtor(target.constructor)
          .getAttachedValues()
          .get(propertyKey);
      const nodeInSet = nodeIns || ImmutableSet.of([]);
      const parameters = nodeInSet
          .mapItem(({id}: {id: NodeId<any>, index: number}) => {
            return id;
          });

      Persona.defineRenderer(
          target.constructor as (typeof BaseDisposable),
          propertyKey,
          selector,
          ...parameters);
    };
  };
}

export const render = {
  children: createRenderDecorator<ChildrenSelector<any>>(),
  innerText: createRenderDecorator<InnerTextSelector<any>>(),
};
