import { BaseDisposable } from '../dispose/base-disposable';
import { Bus } from '../event/bus';
import { event } from '../event/event';
import { listener } from '../event/listener';
import { monad } from '../event/monad';
import { on } from '../event/on';
import { SimpleMonad } from '../event/simple-monad';
import { ImmutableMap } from '../immutable/immutable-map';
import { MonadFactory } from '../interfaces/monad-factory';
import { assert, TestBase } from '../test-base';
import { TestDispose } from '../testing/test-dispose';
import { Log } from '../util/log';

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
  onEventA(@event() event: TestEventA): void {
    this.spy_.onEventA(event);
  }

  @on(TEST_EVENT_BUS, 'eventB')
  onEventB(@event() event: TestEventB): void {
    this.spy_.onEventB(event);
  }

  @on(TEST_EVENT_BUS, 'eventB')
  onMonad(@monad(TEST_MONAD_FACTORY) value: number): ImmutableMap<MonadFactory<any>, any> {
    return this.spy_.onMonad(value);
  }
}

describe('event functional test', () => {
  let mockSpy;
  let instance;

  beforeEach(() => {
    mockSpy = jasmine.createSpyObj('Spy', ['onEventA', 'onEventB', 'onMonad']);
    instance = new TestClass(mockSpy);
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
    mockSpy.onMonad.and.returnValue(ImmutableMap.of([[TEST_MONAD_FACTORY, newValue]]));

    const event: TestEventB = {payload: 123, type: 'eventB'};
    TEST_EVENT_BUS.dispatch(event);
    assert(mockSpy.onMonad).to.haveBeenCalledWith(1);

    TEST_EVENT_BUS.dispatch(event);
    assert(mockSpy.onMonad).to.haveBeenCalledWith(newValue);
  });
});
