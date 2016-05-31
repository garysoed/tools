/**
 * A chainable iterable object.
 *
 * Iterables are collection of object. What makes iterable unique is that the length of an iterable
 * may be infinite. Thus, any operations to an iterable cannot require iterating to the end of the
 * iterable, since there may not be any ends.
 *
 * @param <T> Type of elements in the iterable.
 */
export interface IFluentIterable<T> {
  /**
   * Adds all elements in the given iterable to the end of the current iterable.
   * @param other The iterable to add to the current iterable.
   * @return The chainable iterable object with the given iterable added to the end of the current
   *    iterable
   */
  addAll(other: Iterable<T>): IFluentIterable<T>;

  /**
   * Adds all eleents in the given array to the end of the current iterable.
   *
   * @param array The array to add to the current iterable.
   * @return The chainable iterable object with the given array added to the end of the current
   *    iterable.
   */
  addAllArray(array: T[]): IFluentIterable<T>;

  /**
   * @return The fluent iterable as an iterable object.
   */
  asIterable(): Iterable<T>;

  /**
   * @return A new iterator instance of the iterable.
   */
  asIterator(): Iterator<T>;

  /**
   * Applies the given filter to the iterable.
   *
   * @param fn Function that takes the member of the iterable and returns true iff the member should
   *    be kept in the iterable.
   * @return Fluent iterable object with the filter function applied.
   */
  filter(fn: (value: T) => boolean): IFluentIterable<T>;

  /**
   * Iterates through all the elements in the iterable.
   *
   * @param fn Function that will be called for every element in the iterable. This function takes
   *    two arguments: the element in the iterable and a break function. If the break function is
   *    called, the iteration will stop immediately.
   * @return This fluent iterable for chaining.
   */
  iterate(fn: (value: T, breakFn: () => void) => void): IFluentIterable<T>;

  /**
   * Maps the member of this iterable using the given mapping function
   *
   * @param fn Function that is called for every element in the iterable. This function takes the
   *    element in the iterable and should return the transformed element.
   * @param <T2> The type of the transformed element.
   * @return This fluent iterable with the mapping function applied to the elements.
   */
  map<T2>(fn: (value: T) => T2): IFluentIterable<T2>;
}

/**
 * A chainable non indexable object.
 *
 * Non indexables are collections whose elements cannot be indexed. They include any finite
 * collections whose elements cannot be ordered, such as sets.
 *
 * @param <T> Type of element in the collection.
 */
export interface IFluentNonIndexable<T> extends IFluentIterable<T> {
  /**
   * Returns the non indexable as an array.
   *
   * @return The array containing elements in the non indexable.
   */
  asArray(): T[];

  /**
   * Returns the non indexable as a set.
   *
   * @return The set containing elements in the non indexable.
   */
  asSet(): Set<T>;

  /**
   * Finds an element matching the given match function.
   * @param fn The matching function. This takes in an element in the non iterable and returns
   *    true iff it the element is the searched element.
   * @return The searched element, or null if not found.
   */
  find(fn: (value: T) => boolean): T;

  /**
   * Calls the given function for every element in the non indexable.
   *
   * @param fn Function to call for every element in the non indexable. This function takes in an
   *    element of the non indexable.
   * @return This object for chaining.
   */
  forEach(fn: (value: T) => void): IFluentNonIndexable<T>;

  /**
   * Calls the given function for all the elements in the non indexable.
   *
   * @param fn Function that will be called for every element in the non indexable. This function
   *    takes two arguments: the element in the iterable and a break function. If the break function
   *    is called, the no more elements will be called.
   * @return This object for chaining.
   */
  forOf(fn: (value: T, breakFn: () => void) => void): IFluentNonIndexable<T>;

  /**
   * Removes all elements in the given set from this non indexable.
   *
   * @param toRemove Set of elements to be removed from this non indexable.
   * @return Non indexable with the specified elements removed.
   */
  removeAll(toRemove: Set<T>): IFluentNonIndexable<T>;
}

/**
 * A chainable mappable object.
 *
 * A mappable is a collection of elements where each element has an associated key (or index).
 * Since the key can be of any type, there is no ordering defined inherently. Examples of mappable
 * objects include maps and records.
 *
 * @param <K> Type of key in the mappable.
 * @param <V> Type of value in the mappable.
 */
export interface IFluentMappable<K, V> extends IFluentIterable<[K, V]> {
  /**
   * Adds all the entries in the given map to the current mappable.
   *
   * @param map The map whose entries should be added to the current mappable.
   * @return This mappable with the map entries added.
   */
  addAllMap(map: Map<K, V>): IFluentMappable<K, V>;

  /**
   * Returns the collection as a map.
   *
   * @return The collection as a map.
   */
  asMap(): Map<K, V>;

  /**
   * Returns the collection has a record.
   *
   * @param toString Optional function to convert keys to string. This takes in a key and returns
   *    the string that corresponds to the key. Defaults to function that just passes back the key.
   * @return The collection as a record.
   */
  asRecord(toString?: (key: K) => string): {[key: string]: V};

  /**
   * Filters the mappable by the filter function.
   *
   * @param filterFn Function that takes in the value and its corresponding key and returns true iff
   *    the entry should be in the resulting map.
   * @return The filtered map.
   */
  filterEntry(filterFn: (value: V, key: K) => boolean): IFluentMappable<K, V>;

  /**
   * Finds entry that matches the given find function and returns it.
   *
   * @param fn Function that takes in the value and its corresponding key and returns true iff the
   *    entry should be returned.
   * @return The first entry that matches the find function, or null if it is not found.
   */
  findEntry(fn: (value: V, key: K) => boolean): [K, V];

  /**
   * Finds entry that matches the given find function and returns the corresponding key.
   *
   * @param fn Function that takes in the value and its corresponding key and returns true iff the
   *    entry should be returned.
   * @return Key of the first entry that matches the find function, or null if it is not found.
   */
  findKey(fn: (value: V, key: K) => boolean): K;

  /**
   * Finds entry that matches the given find function and returns the corresponding value.
   *
   * @param fn Function that takes in the value and its corresponding value and returns true iff the
   *    entry should be returned.
   * @return Value of the first entry that matches the find function, or null if it is not found.
   */
  findValue(fn: (value: V, key: K) => boolean): V;

  /**
   * Calls the given function for every entry in the mappable.
   *
   * @param fn Function to call for every element in the mappable. This function takes in the value
   *    and its corresponding key for every entry in the mappable.
   * @return This object for chaining.
   */
  forEach(fn: (value: V, key: K) => void): IFluentMappable<K, V>;

  /**
   * Calls the given function for all the entry in the mappable.
   *
   * @param fn Function that will be called for every entry in the mappable. This function takes
   *    three arguments: the value in the mappable, its corresponding key, and a break function. If
   *    the break function is called, the no more elements will be called.
   * @return This object for chaining.
   */
  forOf(fn: (value: V, key: K, breakFn: () => void) => void): IFluentMappable<K, V>;

  /**
   * Returns all the keys in the mappable.
   *
   * @return All keys in the mappable.
   */
  keys(): IFluentNonIndexable<K>;

  /**
   * Maps the keys of this mappable using the given mapping function
   *
   * @param fn Function that is called for every key in the mappable. This function takes the value
   *    and its corresponding key in the mappable and should return the transformed key.
   * @param <K2> The type of the transformed key.
   * @return This fluent mappable with the mapping function applied to the keys.
   */
  mapKey<K2>(fn: (value: V, key: K) => K2): IFluentMappable<K2, V>;

  /**
   * Maps the values of this mappable using the given mapping function
   *
   * @param fn Function that is called for every value in the mappable. This function takes the
   *    value and its coresponding key in the mappable and should return the transformed value.
   * @param <V2> The type of the transformed value.
   * @return This fluent mappable with the mapping function applied to the values.
   */
  mapValue<V2>(fn: (value: V, key: K) => V2): IFluentMappable<K, V2>;

  /**
   * Removes all entries that matches the key in the given set.
   *
   * @param toRemove Set of keys to remove from the map.
   * @return This map with the specified keys removed.
   */
  removeAllKeys(toRemove: Set<K>): IFluentMappable<K, V>;

  /**
   * Returns all the values in the mappable.
   *
   * @return All values in the mappable.
   */
  values(): IFluentNonIndexable<V>;
}

/**
 * A chainable indexable object.
 *
 * An indexable is a collection of elements where each element has an associated index in the
 * collection.
 *
 * @param <T> Type of value in the indexable.
 */
export interface IFluentIndexable<T> extends IFluentIterable<T> {
  /**
   * Returns the indexable as an array.
   *
   * @return The indexable as an array.
   */
  asArray(): Array<T>;

  /**
   * Returns true iff every element in the indexable fulfills the given check function.
   *
   * @param checkFn The function to check the element in the indexable. This function takes in the
   *    value of the element and its index and should return true iff the element passes the check.
   * @return True iff all element in the indexable passes the check.
   */
  every(checkFn: (value: T, index: number) => boolean): boolean;

  /**
   * Filters the indexable by the given filter function.
   *
   * @param fn The filter function. This function accepts the element in the indexable and its
   *    index. Itshould return true iff the element should be in the resulting indexable.
   * @return The filtered indexable.
   */
  filterElement(fn: (value: T, index: number) => boolean): IFluentIndexable<T>;

  /**
   * Finds element that matches the given find function and returns it.
   *
   * @param fn Function that takes in the element and returns true iff the element should be
   *    returned.
   * @return The first element that matches the find function, or null if it is not found.
   */
  find(fn: (value: T, index: number) => boolean): T;

  /**
   * Finds element that matches the given find function and returns its index.
   *
   * @param fn Function that takes in the element and returns true iff the element should be
   *    returned.
   * @return The index of the first element that matches the find function, or null if it is not
   *    found.
   */
  findIndex(fn: (value: T, index: number) => boolean): number;

  /**
   * Calls the given function for every element in the indexable.
   *
   * @param fn Function to call for every element in the indexable. This function takes in the value
   *    and its index for every element in the indexable.
   * @return This object for chaining.
   */
  forEach(fn: (value: T, index: number) => void): IFluentIndexable<T>;

  /**
   * Calls the given function for all the elements in the indexable.
   *
   * @param fn Function that will be called for every element in the indexable. This function
   *    takes three arguments: the value in the mappable, its corresponding index, and a break
   *    function. If the break function is called, the no more elements will be called.
   * @return This object for chaining.
   */
  forOf(fn: (value: T, index: number, breakFn: () => void) => void): IFluentIndexable<T>;

  /**
   * Maps the elements in the indexable.
   *
   * @param fn The mapping function. This takes in an element of the indexable and its index and
   *    returns the transformed element.
   * @param <T2> The type of the transformed element.
   */
  mapElement<T2>(fn: (value: T, index: number) => T2): IFluentIndexable<T2>;

  /**
   * Removes all elements in the given set.
   *
   * @param toRemove Set of elements to remove from the indexable.
   * @return This indexable with the specified keys removed.
   */
  removeAll(toRemove: Set<T>): IFluentIndexable<T>;
}
