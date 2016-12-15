import {Annotations} from '../data/annotations';
import {Arrays} from '../collection/arrays';
import {BaseDisposable} from '../dispose/base-disposable';
import {DisposableFunction} from '../dispose/disposable-function';
import {IAttributeParser, IHandler} from './interfaces';
import {Maps} from '../collection/maps';


export type AttributeChangeHandlerConfig = {
  attributeName: string,
  handlerKey: string | symbol,
  parser: IAttributeParser<any>,
  selector: string | null,
};

export const ATTR_CHANGE_ANNOTATIONS: Annotations<AttributeChangeHandlerConfig> =
    Annotations.of<AttributeChangeHandlerConfig>(Symbol('attributeChangeHandler'));


/**
 * Handles attribute changes.
 */
export class AttributeChangeHandler implements IHandler<AttributeChangeHandlerConfig> {

  /**
   * @param callback
   * @return New instance of mutation observer.
   */
  createMutationObserver_(
      instance: BaseDisposable,
      groupedConfig: Map<string, AttributeChangeHandlerConfig[]>): MutationObserver {
    return new MutationObserver(this.onMutation_.bind(this, instance, groupedConfig));
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
      configs: Map<string, AttributeChangeHandlerConfig[]>,
      records: MutationRecord[]): void {
    Arrays.of(records)
        .forEach((record: MutationRecord) => {
          let attributeName = record.attributeName;
          if (attributeName === null) {
            return;
          }

          if (configs.has(attributeName)) {
            Arrays
                .of(configs.get(attributeName)!)
                .forEach(((attributeName: string, config: AttributeChangeHandlerConfig) => {
                  let {handlerKey, parser} = config;
                  let handler = instance[handlerKey];
                  if (!!handler) {
                    let targetNode = record.target;
                    if (targetNode instanceof Element) {
                      let oldValue = parser.parse(record.oldValue);
                      let newValue = parser.parse(targetNode.getAttribute(attributeName));
                      handler.call(instance, newValue, oldValue);
                    }
                  }
                }).bind(this, attributeName));
          }
        });
  }

  /**
   * @override
   */
  configure(
      targetEl: Element,
      instance: BaseDisposable,
      configs: AttributeChangeHandlerConfig[]): void {
    // Group the configs together.
    let configEntries: [string, AttributeChangeHandlerConfig][] = Arrays
        .of(configs)
        .map((config: AttributeChangeHandlerConfig):
            [string, AttributeChangeHandlerConfig] => {
          return [config.attributeName, config];
        })
        .asArray();
    let groupedConfig: Map<string, AttributeChangeHandlerConfig[]> =
        Maps.group(configEntries).asMap();
    let observer = this.createMutationObserver_(instance, groupedConfig);

    let attributeFilter = Arrays
        .of(configs)
        .map((config: AttributeChangeHandlerConfig) => {
          return config.attributeName;
        })
        .asArray();
    observer.observe(
        targetEl,
        {attributeFilter: attributeFilter, attributeOldValue: true, attributes: true});

    // Calls the initial "change".
    Maps
        .of(groupedConfig)
        .keys()
        .forEach((attributeName: string) => {
          this.onMutation_(
              instance,
              groupedConfig,
              [{
                addedNodes: <NodeList> <any> {length: 0},
                attributeName: attributeName,
                attributeNamespace: null,
                nextSibling: null,
                oldValue: null,
                previousSibling: null,
                removedNodes: <NodeList> <any> {length: 0},
                target: targetEl,
                type: 'attributes',
              }]);
        });
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
  createDecorator(
      attributeName: string,
      parser: IAttributeParser<any>,
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
            parser: parser,
            selector: selector,
          });
      return descriptor;
    };
  }

  /**
   * @override
   */
  getConfigs(instance: BaseDisposable): Map<string | symbol, AttributeChangeHandlerConfig> {
    return ATTR_CHANGE_ANNOTATIONS
        .forCtor(instance.constructor)
        .getAttachedValues();
  }
};
