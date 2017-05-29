import { BaseDisposable } from '../dispose/base-disposable';
import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableSet } from '../immutable/immutable-set';
import { Iterables } from '../immutable/iterables';
import { Parser } from '../interfaces/parser';
import { AttributeChangeHandler } from '../webc/attribute-change-handler';
import { ChildListChangeHandler } from '../webc/child-list-change-handler';
import { EventHandler } from '../webc/event-handler';
import { IHandler } from '../webc/interfaces';
import { Util } from '../webc/util';


export const ATTRIBUTE_CHANGE_HANDLER = new AttributeChangeHandler();
export const CHILD_LIST_CHANGE_HANDLER = new ChildListChangeHandler();
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
  attributeChange(attributeName: string): MethodDecorator {
    return ATTRIBUTE_CHANGE_HANDLER.createDecorator(attributeName, this.selector_);
  }

  /**
   * Annotates the method to handle child list changes.
   * @return The method decorator.
   */
  childListChange(): MethodDecorator {
    return CHILD_LIST_CHANGE_HANDLER.createDecorator(this.selector_);
  }

  /**
   * Annotates the method to handle the given DOM event.
   *
   * @param selector The selector of the element to listen to events to.
   * @param event The event to listen to.
   * @return The method decorator.
   */
  event(event: string, boundArgs: any[] = []): MethodDecorator {
    return EVENT_HANDLER.createDecorator(event, this.selector_, boundArgs);
  }

  /**
   * Configures the given instance to handle events from the given element.
   *
   * @param element The element that the given instance is listening to.
   * @param instance The handler for events on the given element.
   */
  static configure(element: HTMLElement, instance: BaseDisposable): void {
    const unresolvedSelectors = ImmutableSet
        .of<string | null>([])
        .addAll(Handler.configure_(element, instance, ATTRIBUTE_CHANGE_HANDLER))
        .addAll(Handler.configure_(element, instance, EVENT_HANDLER))
        .addAll(Handler.configure_(element, instance, CHILD_LIST_CHANGE_HANDLER));

    const selectorsString = ImmutableList.of(unresolvedSelectors).toArray().join(', ');

    if (unresolvedSelectors.size() > 0) {
      throw new Error(`The following selectors cannot be resolved for handle: ${selectorsString}`);
    }
  }

  private static configure_<T extends {selector: string | null}>(
      parentElement: HTMLElement,
      instance: BaseDisposable,
      handler: IHandler<T>): ImmutableSet<string | null> {
    const unresolvedSelectors = new Set<string | null>();
    const configEntries = handler
        .getConfigs(instance)
        .values()
        .mapItem((configs: ImmutableSet<T>): [Element | null, T][] => {
          const entries = configs
              .mapItem((config: T): [Element | null, T] => {
                const selector = config.selector;
                const element = Util.resolveSelector(selector, parentElement);
                if (element === null) {
                  unresolvedSelectors.add(selector);
                }

                // Element can be null, but keep going to make debugging easier.
                return [element, config];
              });
          return Iterables.toArray(entries);
        });

    const entryMap = new Map();
    for (const configEntry of configEntries) {
      for (const [element, config] of configEntry) {
        const existingConfigs = entryMap.get(element);
        if (existingConfigs === undefined) {
          entryMap.set(element, ImmutableSet.of([config]));
        } else {
          entryMap.set(element, existingConfigs.add(config));
        }
      }
    }

    for (const [targetEl, configs] of entryMap) {
      if (targetEl !== null) {
        handler.configure(targetEl, instance, configs);
      }
    }

    return ImmutableSet.of(unresolvedSelectors);
  }
}

export function handle(selector: string | null): Handler {
  return new Handler(selector);
}
// TODO: Mutable
