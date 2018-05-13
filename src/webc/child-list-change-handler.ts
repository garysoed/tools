import { Annotations } from '../data/annotations';
import { BaseDisposable } from '../dispose/base-disposable';
import { DisposableFunction } from '../dispose/disposable-function';
import { MonadUtil } from '../event/monad-util';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { ElementSelector } from '../interfaces/selector';
import { BaseElement } from '../webc/base-element';
import { Handler } from '../webc/handler';


export type ChildListChangeConfig = {
  handlerKey: string | symbol,
  selector: ElementSelector,
};

export const CHILD_LIST_CHANGE_ANNOTATIONS: Annotations<ChildListChangeConfig> =
    Annotations.of<ChildListChangeConfig>(Symbol('childListChangeHandler'));


/**
 * Handles child list changes.
 */
export class ChildListChangeHandler implements Handler<ChildListChangeConfig> {

  /**
   * @override
   */
  configure(
      targetEl: Element,
      instance: BaseDisposable,
      configs: ImmutableSet<ChildListChangeConfig>): void {
    const handlerKeys = configs
        .mapItem((config: ChildListChangeConfig) => {
          return config.handlerKey;
        });
    const observer = this.createMutationObserver_(instance, handlerKeys);
    observer.observe(targetEl, {childList: true});

    // Calls the initial "change".
    const nodeList = this.createNodeList_(targetEl.children);
    this.onMutation_(
        instance,
        handlerKeys,
        ImmutableSet.of([{
          addedNodes: nodeList,
          attributeName: null,
          attributeNamespace: null,
          nextSibling: null,
          oldValue: null,
          previousSibling: null,
          removedNodes: {length: 0} as any as NodeList,
          target: targetEl,
          type: 'childList' as any,
        }]));
    instance.addDisposable(DisposableFunction.of(() => {
      observer.disconnect();
    }));
  }

  /**
   * Creates a new decorator.
   *
   * @param attributeName The name of attribute to watch for changes.
   * @param parser The parser to parse the value of the attribute.
   * @param selector The selector for the element whose attribute changes should be listened to.
   * @return The method decorator. The method take in 2 arguments: the new parsed value of the
   *    attribute and the old parsed value of the attribute.
   */
  createDecorator(selector: ElementSelector): MethodDecorator {
    return function(
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor): PropertyDescriptor {
      CHILD_LIST_CHANGE_ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
          propertyKey,
          {
            handlerKey: propertyKey,
            selector,
          });
      return descriptor;
    };
  }

  /**
   * @param callback
   * @return New instance of mutation observer.
   */
  createMutationObserver_(
      instance: BaseDisposable,
      handlerKeys: ImmutableSet<string | symbol>): MutationObserver {
    return new MutationObserver(this.onMutation_.bind(this, instance, handlerKeys));
  }

  /**
   * Creates a node list object from the given HTMLCollection object.
   * @param collection HTMLCollection object to create the node list from.
   * @return The newly created nodelist object.
   */
  createNodeList_(collection: HTMLCollection): NodeList {
    const nodeList = {
      length: collection.length,
      item(index: number): Node {
        return collection.item(index);
      },
    } as NodeList;

    for (let i = 0; i < collection.length; i++) {
      nodeList[i] = collection.item(i);
    }
    return nodeList;
  }

  /**
   * @override
   */
  getConfigs(instance: BaseDisposable):
      ImmutableMap<string | symbol, ImmutableSet<ChildListChangeConfig>> {
    return CHILD_LIST_CHANGE_ANNOTATIONS
        .forCtor(instance.constructor)
        .getAttachedValues();
  }

  /**
   * Handles event when there is a mutation on the mutation observer.
   *
   * @param instance Instance to call the handler on.
   * @param handlerKeys Set of handler keys.
   * @param records Records collected by the mutation observer.
   */
  onMutation_(
      instance: any,
      handlerKeys: ImmutableSet<string | symbol>,
      records: ImmutableSet<MutationRecord>): void {
    for (const record of records) {
      for (const handlerKey of handlerKeys) {
        const handler = instance[handlerKey];
        if (instance instanceof BaseElement) {
          if (handler) {
            handler.call(instance, record.addedNodes, record.removedNodes);
          }
        } else {
          MonadUtil.callFunction(
              {added: record.addedNodes, type: 'gs-childlistchange', removed: record.removedNodes},
              instance,
              handlerKey);
        }
      }
    }
  }
}
