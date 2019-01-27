# Pocket

This is a library of tools for dealing with collections.

Each collection is a type of `Stream`. A `Stream` has the following characteristics:

-   They are **ordered**.
-   They are **immutable**.
-   They can be infinite, or finite. Finite `Stream`s has a `isFinite` property whose value is
    `true`.
-   They can be keyed. A keyed `Stream` has a method `getKey` which takes in the item in the stream
    and returns a key.

Most operations in this library are **lazy**. This lets you to manipulate infinitely large data
structures.

## Data Structures

`Pocket` comes with 5 data structures. These data structures are all `Stream`s:

-   `InfiniteList<T>`: This is a `Stream` of items of type `T`. The size of this list may be
    infinite.
-   `InfiniteMap<K, V>`: This is a keyed `Stream` of items of type `[K, V]`. The key is typed `K`.
-   `ImmutableList<T>`: This is the finite version of `InfiniteList<T>`.
-   `ImmutableMap<K, V>`: This is the finite version of `InfiniteMap<K, V>`.
-   `ImmutableSet<T>`: This is an `InfiniteList<T>` whose items are guaranteed to be distinct.

## Operators

All operations must use the `$pipe` method to apply to the data structure.

Some examples:

```typescript
// Creates InfiniteList of [0, 1, 2, 3, 4, ...].
const list = counting();

// Creates Stream of [2, 4, 6, 8, ...].
const evens = $pipe(
    list,
    $filter(i => (i % 2) === 0), // Even numbers only
);
```

Operators like `$filter` operates on every item in the stream. Note that operators such as `$filter`
may take out an item from the stream.

Since the operators are lazy, none of the filtering operation happens, until a terminating operation
is applied to the pipe. For example:

```typescript
// Returns 6
const thirdEven = $pipe(
    evens,
    $skip(3), // Skips the first 3 evens
    $head(), // Takes the first item in the Stream.
);
```

When `$head` is applied, `Pocket` will run through the list `[0, 1, 2, 3, 4, 5, 6]` until there is
an item that passes through the filters `$filter` and `$skip`. `[0, 2, 4]` are all blocked by
`$skip`, while `[1, 3, 5]` are blocked by `$filter`. `6` is the first item that are not blocked, and
`$head` returns this.

