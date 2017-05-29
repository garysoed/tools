import { Annotations } from '../data/annotations';
import { BaseDisposable } from '../dispose/base-disposable';
import { DisposableFunction } from '../dispose/disposable-function';
import { MonadUtil } from '../event/monad-util';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Iterables } from '../immutable/iterables';
import { Parser } from '../interfaces/parser';
import { IHandler } from '../webc/interfaces';


export type AttributeChangeHandlerConfig = {
  attributeName: string,
  handlerKey: string | symbol,
  parser: Parser<any>,
  selector: string | null,
};

type GroupedConfig = ImmutableMap<string, ImmutableSet<AttributeChangeHandlerConfig>>;

export const ATTR_CHANGE_ANNOTATIONS: Annotations<AttributeChangeHandlerConfig> =
    Annotations.of<AttributeChangeHandlerConfig>(Symbol('attributeChangeHandler'));


/**
 * Handles attribute changes.
 */
export class AttributeChangeHandler implements IHandler<AttributeChangeHandlerConfig> {
  /**
   * @override
   */
  configure(
      targetEl: Element,
      instance: BaseDisposable,
      configs: ImmutableSet<AttributeChangeHandlerConfig>): void {
    // Group the configs together.
    const configEntries: ImmutableSet<[string, AttributeChangeHandlerConfig]> = configs
        .mapItem((config: AttributeChangeHandlerConfig):
            [string, AttributeChangeHandlerConfig] => {
          return [config.attributeName, config];
        });

    const map: Map<string, ImmutableSet<AttributeChangeHandlerConfig>> = new Map();
    for (const [attrName, config] of configEntries) {
      const set = map.get(attrName);
      if (set === undefined) {
        map.set(attrName, ImmutableSet.of([config]));
      } else {
        map.set(attrName, set.add(config));
      }
    }
    const groupedConfig: GroupedConfig = ImmutableMap.of(map);
    const observer = this.createMutationObserver_(instance, groupedConfig);

    const attributeFilter = Iterables.toArray(configs
        .mapItem((config: AttributeChangeHandlerConfig) => {
          return config.attributeName;
        }));
    observer.observe(
        targetEl,
        {attributeFilter, attributeOldValue: true, attributes: true});

    // Calls the initial "change".
    for (const attributeName of groupedConfig.keys()) {
      this.onMutation_(
          instance,
          groupedConfig,
          ImmutableSet.of([{
            addedNodes: {length: 0} as any as NodeList,
            attributeName: attributeName,
            attributeNamespace: null,
            nextSibling: null,
            oldValue: null,
            previousSibling: null,
            removedNodes: {length: 0} as any as NodeList,
            target: targetEl,
            type: 'attributes',
          }]));
    }
    instance.addDisposable(DisposableFunction.of(() => {
      observer.disconnect();
    }));
  }

  /**
   * Creates a new decorator.
   *
   * @param attributeName The name of attribute to watch for changes.
   * @param selector The selector for the element whose attribute changes should be listened to.
   * @return The method decorator. The method take in 2 arguments: the new parsed value of the
   *    attribute and the old parsed value of the attribute.
   */
  createDecorator(
      attributeName: string,
      parser: Parser<any>,
      selector: string | null): MethodDecorator {
    return function(
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor): PropertyDescriptor {
      ATTR_CHANGE_ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
          propertyKey,
          {
            attributeName: attributeName,
            handlerKey: propertyKey,
            parser,
            selector: selector,
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
      groupedConfig: GroupedConfig): MutationObserver {
    return new MutationObserver(this.onMutation_.bind(this, instance, groupedConfig));
  }

  /**
   * @override
   */
  getConfigs(instance: BaseDisposable):
      ImmutableMap<string | symbol, ImmutableSet<AttributeChangeHandlerConfig>> {
    return ATTR_CHANGE_ANNOTATIONS
        .forCtor(instance.constructor)
        .getAttachedValues();
  }

  /**
   * Handles event when there is a mutation on the mutation observer.
   *
   * @param instance Instance to call the handler on.
   * @param configs Array of attribute change configurations.
   * @param records Records collected by the mutation observer.
   */
  onMutation_(
      instance: any,
      configs: GroupedConfig,
      records: ImmutableSet<MutationRecord>): void {
    for (const record of records) {
      const attributeName = record.attributeName;
      if (attributeName === null) {
        return;
      }

      const matchingConfigs = configs.get(attributeName);
      if (matchingConfigs !== undefined) {
        for (const {handlerKey, parser} of matchingConfigs) {
          MonadUtil.callFunction(
            {
              oldValue: parser.parse(record.oldValue),
              type: 'gse-attributechanged',
            },
            instance,
            handlerKey);
        }
      }
    }
  }
}
