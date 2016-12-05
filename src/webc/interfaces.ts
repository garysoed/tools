export interface IAttributeParser<T> {
  /**
   * Parses the input string.
   *
   * @param input The input string to parse.
   * @return The parsed input string, or null if the parse did not succeed.
   */
  parse(input: string | null): T | null;

  /**
   * Converts the given value to string.
   *
   * @param value The value to be converted to string.
   * @return The string representation of the input value.
   */
  stringify(value: T | null): string;
}

/**
 * Describes a binder to a dom location.
 */
export interface IDomBinder<T> {
  /**
   * Deletes the value.
   */
  delete(): void;

  /**
   * @return The value at the location.
   */
  get(): T | null;

  /**
   * Sets the value to the location.
   * @param value The value to set.
   */
  set(value: T | null): void;
}

/**
 * Configures a element.
 */
export interface IElementConfig {
  /**
   * Mapping of attribute name to attribute parser. The attribute name will be converted to
   * lower-case to be used for the attribute on the element. The element will get a getter / setter
   * which will modify the attribute value directly.
   */
  attributes?: {[name: string]: IAttributeParser<any>};

  /**
   * Element constructor of the dependencies.
   */
  dependencies?: gs.ICtor<any>[];

  /**
   * Tag name of the element.
   */
  tag: string;

  /**
   * Key of template to load from [Templates].
   */
  templateKey: string;
};

