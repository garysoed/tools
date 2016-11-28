import {Annotations} from '../data/annotations';
import {Arrays} from '../collection/arrays';
import {BaseDisposable} from '../dispose/base-disposable';
import {DisposableFunction} from '../dispose/disposable-function';
import {IAttributeParser} from './interfaces';
import {ListenableDom} from '../event/listenable-dom';
import {Maps} from '../collection/maps';


export type AttributeChangeHandlerConfig = {
  attributeName: string,
  handlerKey: string | symbol,
  parser: IAttributeParser<any>,
  selector: SelectorConfig,
};

export type EventHandlerConfig = {
  event: string,
  handlerKey: string | symbol,
  selector: SelectorConfig,
};

export type SelectorConfig = {
  query: string | null,
  useShadow: boolean,
};

export const ATTR_CHANGE_ANNOTATIONS: Annotations<AttributeChangeHandlerConfig> =
    Annotations.of<AttributeChangeHandlerConfig>(Symbol('attributeChangeHandler'));

export const EVENT_ANNOTATIONS: Annotations<EventHandlerConfig> =
    Annotations.of<EventHandlerConfig>(Symbol('eventHandler'));


/**
 * Handles events in the DOM.
 *
 * Use this to annotate methods to handle various DOM events.
 */
export class Handler {
  private useShadow_: boolean;

  /**
   * @param useShadow True iff evaluating the selector should look in the element's shadow root.
   */
  constructor(useShadow: boolean) {
    this.useShadow_ = useShadow;
  }

  /**
   * @param instance Instance to call the handler on.
   * @param configs Configurations to configure the element.
   * @param targetEl Target element to listen to attribute change events.
   */
  private static configureAttrChangeHandler_(
      instance: BaseDisposable,
      configs: AttributeChangeHandlerConfig[],
      targetEl: Element): void {
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
    let observer = Handler.createMutationObserver_(
        Handler.onMutation_.bind(this, instance, groupedConfig));
    observer.observe(targetEl, {attributes: true});

    // Calls the initial "change".
    Maps
        .of(groupedConfig)
        .keys()
        .forEach((attributeName: string) => {
          Handler.onMutation_(instance, groupedConfig, [{
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
   * @param instance Instance to call the handler on.
   * @param configs Configurations to configure the element.
   * @param targetEl Target element to listen to events.
   */
  private static configureEventHandler_(
      instance: BaseDisposable,
      configs: EventHandlerConfig[],
      targetEl: Element): void {
    let listenable = ListenableDom.of(targetEl);
    Arrays
        .of(configs)
        .forEach((config: EventHandlerConfig) => {
          instance.addDisposable(listenable.on(
              config.event,
              instance[config.handlerKey].bind(instance)));
        });
    instance.addDisposable(listenable);
  }

  /**
   * @param callback
   * @return New instance of mutation observer.
   */
  private static createMutationObserver_(callback: MutationCallback): MutationObserver {
    return new MutationObserver(callback);
  }

  /**
   * Gets the target element according to the given config.
   *
   * @param config The configuration to use to get the target element.
   * @param element The root of the element.
   * @return The target element.
   */
  private static getTargetEl_(
      selector: SelectorConfig,
      element: HTMLElement): Element {
    let rootEl = selector.useShadow ? element.shadowRoot : element;
    return selector.query === null ? rootEl : rootEl.querySelector(selector.query);
  }

  /**
   * Handles event when there is a mutation on the mutation observer.
   *
   * @param instance Instance to call the handler on.
   * @param configs Array of attribute change configurations.
   * @param records Records collected by the mutation observer.
   */
  private static onMutation_(
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
   * Annotates the method to handle attribute changes.
   *
   * The method should take two parameters: the new parsed value of the attribute and the old parsed
   * value of the attribute.
   *
   * @param selector The selector of the element to listen to attribute changes to.
   * @param attributeName Name of the attribute to watch.
   * @param parser Parser to parse the attribute value.
   * @return The method decorator.
   */
  attributeChange(
      selector: string | null,
      attributeName: string,
      parser: IAttributeParser<any>): MethodDecorator {
    return function(
        useShadow: boolean,
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor): PropertyDescriptor {
      ATTR_CHANGE_ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
          propertyKey,
          {
            attributeName: attributeName,
            handlerKey: propertyKey,
            parser: parser,
            selector: {
              query: selector,
              useShadow: useShadow,
            },
          });
      return descriptor;
    }.bind(null, this.useShadow_);
  }

  /**
   * Annotates the method to handle the given DOM event.
   *
   * @param selector The selector of the element to listen to events to.
   * @param event The event to listen to.
   * @return The method decorator.
   */
  event(selector: string | null, event: string): MethodDecorator {
    return function(
        useShadow: boolean,
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor): PropertyDescriptor {
      EVENT_ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
          propertyKey,
          {
            event: event,
            handlerKey: propertyKey,
            selector: {
              query: selector,
              useShadow: useShadow,
            },
          });
      return descriptor;
    }.bind(null, this.useShadow_);
  }

  /**
   * Configures the given instance to handle events from the given element.
   *
   * @param element The element that the given instance is listening to.
   * @param instance The handler for events on the given element.
   */
  static configure(element: HTMLElement, instance: BaseDisposable): void {
    // Configures the attr change handlers.
    let attrChangeConfigEntries = Maps
        .of(
            ATTR_CHANGE_ANNOTATIONS
                .forCtor(instance.constructor)
                .getAttachedValues())
        .values()
        .map((config: AttributeChangeHandlerConfig):
            [Element, AttributeChangeHandlerConfig] => {
          return [Handler.getTargetEl_(config.selector, element), config];
        })
        .asArray();

    Maps
        .group(attrChangeConfigEntries)
        .forEach((configs: AttributeChangeHandlerConfig[], targetEl: Element) => {
          Handler.configureAttrChangeHandler_(instance, configs, targetEl);
        });

    // Configures the event handlers.
    let eventHandlerConfigEntries = Maps
        .of(EVENT_ANNOTATIONS.forCtor(instance.constructor).getAttachedValues())
        .values()
        .map((config: EventHandlerConfig): [Element, EventHandlerConfig] => {
          return [Handler.getTargetEl_(config.selector, element), config];
        })
        .asArray();

    Maps
        .group(eventHandlerConfigEntries)
        .forEach((configs: EventHandlerConfig[], targetEl: Element) => {
          Handler.configureEventHandler_(instance, configs, targetEl);
        });
  }
}

export const handle = {
  host: new Handler(false),
  shadow: new Handler(true),
};
