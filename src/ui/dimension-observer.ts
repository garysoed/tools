import { Interval } from '../async/interval';
import { BaseDisposable } from '../dispose/base-disposable';
import { DisposableFunction } from '../dispose/disposable-function';
import { DisposableFunction as IDisposableFunction} from '../interfaces/disposable-function';
import { Reflect } from '../util/reflect';

type ObservationData = {
  boundingRect: ClientRect | null,
  unregisterFn: DisposableFunction,
};

export class DimensionObserver extends BaseDisposable {
  private readonly interval_: Interval;
  private readonly observedElements_: Map<Element, ObservationData>;

  constructor(private readonly callback_: (clientRect: ClientRect) => any) {
    super();
    this.interval_ = new Interval(30);
    this.addDisposable(this.interval_);

    this.observedElements_ = new Map<Element, ObservationData>();
  }

  [Reflect.__initialize](): void {
    this.addDisposable(this.interval_.on('tick', this.onTick_, this));
    this.interval_.start();
  }

  private hasChanged_(oldClientRect: ClientRect | null, newClientRect: ClientRect): boolean {
    return !oldClientRect ||
        oldClientRect.bottom !== newClientRect.bottom ||
        oldClientRect.height !== newClientRect.height ||
        oldClientRect.left !== newClientRect.left ||
        oldClientRect.right !== newClientRect.right ||
        oldClientRect.top !== newClientRect.top ||
        oldClientRect.width !== newClientRect.width;
  }

  observe(element: Element): IDisposableFunction {
    const observationData = this.observedElements_.get(element);
    if (observationData) {
      return observationData.unregisterFn;
    }

    const unregisterFn = DisposableFunction.of(() => {
      this.observedElements_.delete(element);
    });
    const data = {boundingRect: null, unregisterFn};
    this.observedElements_.set(element, data);
    return unregisterFn;
  }

  private onTick_(): void {
    for (const [observedElement, observationData] of this.observedElements_) {
      const rect = observedElement.getBoundingClientRect();
      if (this.hasChanged_(observationData.boundingRect, rect)) {
        this.callback_(rect);
        observationData.boundingRect = rect;
      }
    }
  }

  static of(callback: (clientRect: ClientRect) => any, context: Object): DimensionObserver {
    const observer = new DimensionObserver(callback.bind(context));
    observer[Reflect.__initialize]();
    return observer;
  }
}
