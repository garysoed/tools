import { BaseDisposable } from '../dispose';
import { ANNOTATIONS } from '../graph/node-in';
import { ImmutableSet } from '../immutable';
import { Persona } from '../persona/persona';
import { Selector } from '../persona/selector';
import { AttributeSelector, ChildrenSelector, InnerTextSelector } from '../persona/selectors';

export function createRenderDecorator<S extends Selector<any>>():
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
      const parameters = [];
      for (const {id, index} of nodeInSet) {
        parameters[index] = id;
      }

      Persona.defineRenderer(
          target.constructor as (typeof BaseDisposable),
          propertyKey,
          selector,
          ...parameters);
    };
  };
}

export const render = {
  attribute: createRenderDecorator<AttributeSelector<any>>(),
  children: createRenderDecorator<ChildrenSelector<any>>(),
  innerText: createRenderDecorator<InnerTextSelector<any>>(),
};
