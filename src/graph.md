Instance graphs (without annotations).
```typescript
const $$a = instanceId('a');
const $$b = instanceId('b');

class TestClass {
  constructor(private readonly b_: number) { }

  providesA(b: number): number {
    return b + 1;
  }

  providesB(): number {
    return this.b_;
  }
}

Graph.registerProvider<number>($$a, TestClass.prototype.providesA, $$b);
Graph.registerProvider

const t1 = new TestClass(2);
Graph.get($$a, t1); // Returns 3.
Graph.get($$a, t1); // Returns 3, cached.

const t2 = new TestClass(3);
Graph.get($$a, t2); // Returns 4.
```

Instance graphs (with annotations).

```typescript
const $$a = instanceId('a');
const $$b = instanceId('b');

class TestClass {
  constructor(private readonly b_: number) { }

  providesA(@nodeIn($$b) b: number): number {
    return b + 1;
  }

  @nodeOut($$b)
  providesB(): number {
    return this.b_;
  }
}

const t1 = new TestClass(2);
Graph.get($$a, t1); // Returns 3.
Graph.get($$a, t1); // Returns 3, cached.

const t2 = new TestClass(3);
Graph.get($$a, t2); // Returns 4.
```

Handling events

```typescript
const $$a = instanceId('a');
const $$b = instanceId('b');

onEvent(callback: (event: Event) => void): void {
  Bus.on('busevent', callback);
}

class TestClass {
  constructor() {
    this.providesB_ = Graph.createProvider($$b, this, 1);
  }

  @nodeOut($$a)
  providesA(@nodeIn($$b) b: number): number {
    return b + 1;
  }

  @on(Bus, 'busevent')
  onEvent(event: Event): void {
    this.providesB_(event.value);
  }
}

const t = new TestClass();
Graph.get($$a, t); // Returns 2, from the default value.

Bus.dispatchEvent({type: 'busevent', value: 4});
Graph.get($$a, t); // Returns 5, from the new value.
```

Event handling.

```typescript
const $$a = instanceId('a');
const $b = staticId('b');

const providesB = Graph.createProvider($b, 2);

class TestClass {
  @on(Graph.eventBus($b), 'changed')
  static function onBChanged(@eventDetails() event: Event): number {
    window.alert(event.value);
  }
}

const t = new TestClass();
providesB(4); // Calls window.alert(4).
```