# Library to cache data and manage cache clearings.

A graph consists of `Node`s. There are two kinds of `Node`s:

-   An `@Input` takes in a value from outside the graph.
-   A `@Pipe` takes in a value from another `Node`.

You may execute any `@Pipe`s to obtain its result. For example:

```typescript
class ExampleClass {
  private value1_: number;

  @Pipe()
  get value1(): number {
    return this.value1_;
  }
  set value1(value: number): void {
    this.value1_ = value;
  }

  @Pipe()
  private examplePipe(
      @Input('value1') value1: number,
      @External('value2') value2: number): number {
    return value1 + value2;
  }
}

let example: ExampleClass = new ExampleClass();
Graph.run(example, 'examplePipe', {'value2': 2}); // Returns 3
```  