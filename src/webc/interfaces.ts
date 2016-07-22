export interface IAttributeParser<T> {
  /**
   * Parses the input string.
   *
   * @param input The input string to parse.
   * @return The parsed input string.
   */
  parse(input: string | null): T;

  /**
   * Converts the given value to string.
   *
   * @param value The value to be converted to string.
   * @return The string representation of the input value.
   */
  stringify(value: T): string;
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

