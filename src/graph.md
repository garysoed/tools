Static graphs.

```typescript
const $a = staticId('a');
const $b = staticId('b');
const $c = staticId('c');

const providerB = Graph.createProvider($b, 3);
const providerC = Graph.createProvider($c, 4);

function providesA(
    @nodeIn($b) b: number,
    @nodeIn($c) c: number): number {
  return b + c;
}
Graph.registerProvider($a, providesA);

Graph.get($a); // Resolves with 7

// This clears the cache for $a.
providerB(2);
Graph.get($a); // Returns 6

Graph.createProvider($a, 7); // Throws error since A has a provider.
```

Instance graphs.

```typescript
const $$a = instanceId('a');
const $$b = instanceId('b');

class TestClass {
  constructor(private readonly b_: number) { }

  @nodeOut($$a)
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