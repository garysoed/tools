import { DisposableFunction } from '../dispose';
import { AssertionError } from '../error';
import { Event } from '../interfaces';
import { ElementSelectorImpl } from '../persona/element-selector';
import { EventListener } from '../persona/event-listener';
import { Listener } from '../persona/listener';
import { ElementSelector } from '../persona/selectors';

export type Key = string;
export type Options = {
  alt?: boolean,
  ctrl?: boolean,
  meta?: boolean,
};

export class KeystrokeListener implements Listener<'keystroke'> {
  private readonly eventListener_: EventListener;

  constructor(
      private readonly key_: Key,
      private readonly options_: Options,
      elementSelector: ElementSelectorImpl<any>) {
    this.eventListener_ = new EventListener(elementSelector, 'keydown');
  }

  private matches_(event: KeyboardEvent): boolean {
    const {alt, ctrl, meta} = this.options_;
    if (alt !== undefined && alt !== event.altKey) {
      return false;
    }

    if (ctrl !== undefined && ctrl !== event.ctrlKey) {
      return false;
    }

    if (meta !== undefined && meta !== event.metaKey) {
      return false;
    }

    return event.key === this.key_;
  }

  start(
      root: ShadowRoot,
      handler: (event: Event<'keystroke'>) => any,
      context: any,
      useCapture: boolean): DisposableFunction {
    return this.eventListener_.start(
        root,
        (event: KeyboardEvent) => {
          if (!this.matches_(event)) {
            return;
          }
          handler.call(context, {type: 'keystroke'});
          event.stopPropagation();
        },
        context,
        useCapture);
  }
}

export function keystrokeListener(
    selector: ElementSelector<any>,
    key: Key,
    options: Options): KeystrokeListener {
  if (!(selector instanceof ElementSelectorImpl)) {
    throw AssertionError.instanceOf('selector', ElementSelectorImpl, selector);
  }

  return new KeystrokeListener(key, options, selector);
}
