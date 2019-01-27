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

All operations
