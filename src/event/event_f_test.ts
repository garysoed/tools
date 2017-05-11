import { BaseDisposable } from '../dispose/base-disposable';
import { Bus } from '../event/bus';
import { listener } from '../event/listener';
import { on } from '../event/on';
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

@listener()
class TestClass extends BaseDisposable {
  constructor(private readonly spy_: any) {
    super();
  }

  @on(TEST_EVENT_BUS, 'eventA')
  onEventA(event: TestEventA): void {
    this.spy_.onEventA(event);
  }

  @on(TEST_EVENT_BUS, 'eventB')
  onEventB(event: TestEventB): void {
    this.spy_.onEventB(event);
  }
}

describe('event functional test', () => {
  let mockSpy;
  let instance;

  beforeEach(() => {
    mockSpy = jasmine.createSpyObj('Spy', ['onEventA', 'onEventB']);
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
});
