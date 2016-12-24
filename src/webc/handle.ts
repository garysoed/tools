import {Arrays} from 'src/collection/arrays';
import {Maps} from 'src/collection/maps';
import {Sets} from 'src/collection/sets';
import {BaseDisposable} from 'src/dispose/base-disposable';
import {Validate} from 'src/valid/validate';

import {AttributeChangeHandler} from './attribute-change-handler';
import {EventHandler} from './event-handler';
import {IAttributeParser, IHandler} from './interfaces';
import {Util} from './util';


export const ATTRIBUTE_CHANGE_HANDLER = new AttributeChangeHandler();
export const EVENT_HANDLER = new EventHandler();


/**
 * Handles events in the DOM.
 *
 * Use this to annotate methods to handle various DOM events.
 */
export class Handler {
  private selector_: string | null;

  /**
   * @param useShadow True iff evaluating the selector should look in the element's shadow root.
   */
  constructor(selector: string | null) {
    this.selector_ = selector;
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
      attributeName: string,
      parser: IAttributeParser<any>): MethodDecorator {
    return ATTRIBUTE_CHANGE_HANDLER.createDecorator(attributeName, parser, this.selector_);
  }

  /**
   * Annotates the method to handle the given DOM event.
   *
   * @param selector The selector of the element to listen to events to.
   * @param event The event to listen to.
   * @return The method decorator.
   */
  event(event: string): MethodDecorator {
    return EVENT_HANDLER.createDecorator(event, this.selector_);
  }

  /**
   * Configures the given instance to handle events from the given element.
   *
   * @param element The element that the given instance is listening to.
   * @param instance The handler for events on the given element.
   */
  static configure(element: HTMLElement, instance: BaseDisposable): void {
    let unresolvedSelectorIterable = Sets
        .of(new Set<string | null>())
        .addAll(Handler.configure_(element, instance, ATTRIBUTE_CHANGE_HANDLER))
        .addAll(Handler.configure_(element, instance, EVENT_HANDLER))
        .asIterable();

    let unresolvedSelectors = Arrays.fromIterable(unresolvedSelectorIterable).asArray();
    let selectorsString = unresolvedSelectors.join(', ');
    Validate.set(new Set(unresolvedSelectors))
        .to.beEmpty()
        .orThrows(`The following selectors cannot be resolved for handle: ${selectorsString}`)
        .assertValid();
  }

  private static configure_<T extends {selector: string | null}>(
      parentElement: HTMLElement,
      instance: BaseDisposable,
      handler: IHandler<T>): Set<string | null> {
    let unresolvedSelectors = new Set<string | null>();
    let configEntries = Maps
        .of(handler.getConfigs(instance))
        .values()
        .map((config: T): [Element | null, T] => {
          let selector = config.selector;
          let element = Util.resolveSelector(selector, parentElement);
          if (element === null) {
            unresolvedSelectors.add(selector);
          }

          // Element can be null, but keep going to make debugging easier.
          return [element, config];
        })
        .asArray();

    Maps
        .group(configEntries)
        .forEach((configs: T[], targetEl: Element | null) => {
          if (targetEl !== null) {
            handler.configure(targetEl, instance, configs);
          }
        });

    return unresolvedSelectors;
  }
}

export function handle(selector: string | null): Handler {
  return new Handler(selector);
};
