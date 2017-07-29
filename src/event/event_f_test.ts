import { assert, TestBase } from '../test-base';

import { BaseDisposable } from '../dispose';
import { Bus, eventDetails, listener, monadOut, on, SimpleMonad } from '../event';
import { ImmutableList, ImmutableMap } from '../immutable';
import { MonadFactory, MonadSetter } from '../interfaces';
import { Fakes } from '../mock/fakes';
import { TestDispose } from '../testing/test-dispose';
import { Log, Reflect } from '../util';

TestBase.setup();

type TestEventType = 'eventA' | 'eventB';
interface TestEventA {
  type: 'eventA';
}

interface TestEventB {
  payload: number;
  type: 'eventB';
}

type TestEvent = TestEventA | TestEventB;


const TEST_EVENT_BUS: Bus<TestEventType, TestEvent> =
    new class extends Bus<TestEventType, TestEvent> {
      constructor() {
        super(Log.of('event.TestEventBus'));
      }
    }();

const TEST_MONAD_FACTORY = SimpleMonad.newFactory<number>(Symbol('test'), 1);

@listener()
class TestClass extends BaseDisposable {
  constructor(private readonly spy_: any) {
    super();
  }

  @on(TEST_EVENT_BUS, 'eventA')
  onEventA(@eventDetails() event: TestEventA): void {
    this.spy_.onEventA(event);
  }

  @on(TEST_EVENT_BUS, 'eventB')
  onEventB(@eventDetails() event: TestEventB): void {
    this.spy_.onEventB(event);
  }

  @on(TEST_EVENT_BUS, 'eventB')
  onMonad(
      @monadOut(TEST_MONAD_FACTORY) monadSetter: MonadSetter<number>):
      ImmutableMap<MonadFactory<any>, any> {
    return this.spy_.onMonad(monadSetter);
  }
}

describe('event functional test', () => {
  let mockSpy: any;
  let instance;

  beforeEach(() => {
    mockSpy = jasmine.createSpyObj('Spy', ['onEventA', 'onEventB', 'onMonad']);
    instance = Reflect.construct(TestClass, [mockSpy]);
    TestDispose.add(instance);
  });

  it('should handle the event correctly', () => {
    const event: TestEventA = {type: 'eventA'};
    TEST_EVENT_BUS.dispatch(event);
    assert(mockSpy.onEventA).to.haveBeenCalledWith(event);
    assert(mockSpy.onEventB).toNot.haveBeenCalled();
  });

  it('should propagate the payload correctly', () => {
    const event: TestEventB = {payload: 123, type: 'eventB'};
    TEST_EVENT_BUS.dispatch(event);
    assert(mockSpy.onEventA).toNot.haveBeenCalled();
    assert(mockSpy.onEventB).to.haveBeenCalledWith(event);
  });

  it('should process the monad correctly', () => {
    const newValue = 123;
    Fakes.build(mockSpy.onMonad)
        .call((setter: any) => ImmutableList.of([setter.set(newValue)]));

    const event: TestEventB = {payload: 123, type: 'eventB'};
    TEST_EVENT_BUS.dispatch(event);
    assert(mockSpy.onMonad.calls.argsFor(0)[0].value).to.equal(1);

    TEST_EVENT_BUS.dispatch(event);
    assert(mockSpy.onMonad.calls.argsFor(1)[0].value).to.equal(newValue);
  });
});
