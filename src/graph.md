Event handling.

```typescript
const $$a = instanceId('a');
const $b = staticId('b');

const providesB = Graph.createProvider($b, 2);

class TestClass {
  @onNode('change', $b)
  static function onBChanged(@eventDetails() event: Event): number {
    window.alert(event.value);
  }
}

const t = new TestClass();
providesB(4); // Calls window.alert(4).
```