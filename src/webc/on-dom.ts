import { BaseDisposable } from '../dispose/base-disposable';
import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableSet } from '../immutable/immutable-set';
import { Iterables } from '../immutable/iterables';
import { AttributeSelector, ElementSelector } from '../interfaces/selector';
import { Log, LogLevel } from '../util/log';
import { AttributeChangeHandler } from '../webc/attribute-change-handler';
import { ChildListChangeHandler } from '../webc/child-list-change-handler';
import { EventHandler } from '../webc/event-handler';
import { IHandler } from '../webc/interfaces';
import { Util } from '../webc/util';

export const ATTRIBUTE_CHANGE_HANDLER = new AttributeChangeHandler();
export const CHILD_LIST_CHANGE_HANDLER = new ChildListChangeHandler();
export const EVENT_HANDLER = new EventHandler();

const LOGGER = Log.of('gs-tools.webc.onDom');
const LOGGED_ELEMENTS: Set<string> = new Set();

class OnDom {
  static attributeChange({name, parser, selector}: AttributeSelector<any>): MethodDecorator {
    return ATTRIBUTE_CHANGE_HANDLER.createDecorator(name, parser, selector);
  }

  static childListChange(selector: ElementSelector): MethodDecorator {
    return CHILD_LIST_CHANGE_HANDLER.createDecorator(selector);
  }

  static configure(element: HTMLElement, instance: BaseDisposable): void {
    const elementName = element.nodeName.toLowerCase();
    const previousLogLevel = Log.getEnabledLevel();
    const logLevel = LOGGED_ELEMENTS.has(elementName) ? LogLevel.WARNING : LogLevel.DEBUG;
    LOGGED_ELEMENTS.add(elementName);

    Log.setEnabledLevel(Math.max(previousLogLevel, logLevel));
    Log.groupCollapsed(LOGGER, `Configuring [${element.nodeName.toLowerCase()}]`);
    const unresolvedSelectors = ImmutableSet
        .of<string | null>([])
        .addAll(onDom.configure_(element, instance, ATTRIBUTE_CHANGE_HANDLER))
        .addAll(onDom.configure_(element, instance, CHILD_LIST_CHANGE_HANDLER))
        .addAll(onDom.configure_(element, instance, EVENT_HANDLER));

    const selectorsString = ImmutableList.of(unresolvedSelectors).toArray().join(', ');

    if (unresolvedSelectors.size() > 0) {
      throw new Error(`The following selectors cannot be resolved for handle: ${selectorsString}`);
    }

    Log.groupEnd(LOGGER);
    Log.setEnabledLevel(previousLogLevel);
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

  static event(selector: ElementSelector, event: string): MethodDecorator {
    return EVENT_HANDLER.createDecorator(event, selector, []);
  }
}

export const onDom = OnDom;
