import {TestBase} from '../test-base';
TestBase.setup();

import {External} from './external';
import {Graph} from './graph';
import {Internal} from './internal';
import {Pipe} from './pipe';


class TestClass {
  calls: string[];
  private getterSetter_: string;

  constructor() {
    this.calls = [];
    this.getterSetter_ = 'oldValue';
  }

  @Pipe()
  noArg(): string {
    this.calls.push('noArg');
    return 'noArg';
  }

  @Pipe()
  externalArg(@External('external') external: string): string {
    this.calls.push('externalArg');
    return external;
  }

  @Pipe()
  get getter(): string {
    this.calls.push('getter');
    return 'getter';
  }

  @Pipe()
  get getterSetter(): string {
    this.calls.push('getterSetter');
    return this.getterSetter_;
  }
  set getterSetter(newValue: string) {
    this.getterSetter_ = newValue;
  }

  @Pipe()
  combine(
      @Internal('noArg') noArg: string,
      @Internal('getter') getter: string,
      @Internal('getterSetter') getterSetter: string): string {
    this.calls.push('combine');
    return [noArg, getter, getterSetter].join(' ');
  }

  @Pipe()
  forwardExternal(
      @Internal('externalArg', {'external': 'forwardExternal'}) externalArg:  string): string {
    this.calls.push('forwardExternal');
    return `forwarded: ${externalArg}`;
  }
}

describe('pipeline', () => {
  let instance;

  beforeEach(() => {
    instance = new TestClass();
  });

  it('should handle pipes with no arguments', () => {
    expect(Graph.run(instance, 'noArg')).toEqual('noArg');
  });

  it('should handle pipes with external arguments', () => {
    expect(Graph.run(instance, 'externalArg', {'external': 'blah'})).toEqual('blah');
  });

  it('should handle getters', () => {
    expect(Graph.run(instance, 'getter')).toEqual('getter');
  });

  it('should handle getter setters', () => {
    let value = 'value';
    instance.getterSetter = value;
    expect(Graph.run(instance, 'getterSetter')).toEqual('value');
  });

  it('should handle dependency pipeline', () => {
    let value = 'value';
    instance.getterSetter = value;
    expect(Graph.run(instance, 'combine')).toEqual(`noArg getter ${value}`);
  });

  it('should handle forwarding external arguments', () => {
    expect(Graph.run(instance, 'forwardExternal', {'forwardExternal': 'blah'}))
        .toEqual('forwarded: blah');
  });

  it('should cache the result for pipes with no arguments', () => {
    Graph.run(instance, 'noArg');
    Graph.run(instance, 'noArg');
    expect(instance.calls).toEqual(['noArg']);
  });

  it('should not cache the result for external arguments if they are different', () => {
    expect(Graph.run(instance, 'externalArg', {'external': 'blah'})).toEqual('blah');
    expect(Graph.run(instance, 'externalArg', {'external': 'blah2'})).toEqual('blah2');
  });

  it('should cache the result for external arguments if they are the same', () => {
    Graph.run(instance, 'externalArg', {'external': 'blah'});
    Graph.run(instance, 'externalArg', {'external': 'blah'});

    expect(instance.calls).toEqual(['externalArg']);
  });

  it('should cache the result for getters', () => {
    Graph.run(instance, 'getter');
    Graph.run(instance, 'getter');
    expect(instance.calls).toEqual(['getter']);
  });

  it('should cache the result for getter setters, until the value is set', () => {
    Graph.run(instance, 'getterSetter');
    Graph.run(instance, 'getterSetter');
    expect(instance.calls).toEqual(['getterSetter']);

    instance.getterSetter = 'newValue';
    Graph.run(instance, 'getterSetter');
    expect(instance.calls).toEqual(['getterSetter', 'getterSetter']);
  });

  it('should cache the result for dependency pipeline, until one of the dependencies is changed',
      () => {
        Graph.run(instance, 'combine');
        Graph.run(instance, 'combine');

        expect(instance.calls).toEqual(['noArg', 'getter', 'getterSetter', 'combine']);
        instance.getterSetter = 'newValue';
        Graph.run(instance, 'combine');

        expect(instance.calls).toEqual([
          'noArg',
          'getter',
          'getterSetter',
          'combine',
          'getterSetter',
          'combine',
        ]);
      });

  it('should not clear the cache if the dependency is updated to a value that is the same',
      () => {
        let value = 'value';

        instance.getterSetter = value;
        Graph.run(instance, 'combine');

        instance.getterSetter = value;
        Graph.run(instance, 'combine');

        expect(instance.calls).toEqual([
          'noArg',
          'getter',
          'getterSetter',
          'combine',
          'getterSetter',
        ]);
      });

  it('should cache the result forwarded external arguments if they are the same', () => {
    Graph.run(instance, 'forwardExternal', {'forwardExternal': 'blah'});
    Graph.run(instance, 'forwardExternal', {'forwardExternal': 'blah'});
    expect(instance.calls).toEqual(['externalArg', 'forwardExternal']);
  });

  it('should not cache the result forwarded external arguments if they are different', () => {
    Graph.run(instance, 'forwardExternal', {'forwardExternal': 'blah1'});
    Graph.run(instance, 'forwardExternal', {'forwardExternal': 'blah2'});
    expect(instance.calls).toEqual([
      'externalArg',
      'forwardExternal',
      'externalArg',
      'forwardExternal',
    ]);
  });
});
