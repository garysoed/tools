/**
 * Configures a element.
 */
import { ImmutableSet } from '../immutable/immutable-set';
import { Parser } from '../interfaces/parser';

export interface ElementConfig {
  /**
   * Mapping of attribute name to attribute parser. The attribute name will be converted to
   * lower-case to be used for the attribute on the element. The element will get a getter / setter
   * which will modify the attribute value directly.
   */
  attributes?: {[name: string]: Parser<any>};

  /**
   * Element constructor of the dependencies.
   */
  dependencies?: ImmutableSet<gs.ICtor<any>>;

  /**
   * Tag name of the element.
   */
  tag: string;

  /**
   * Key of template to load from [Templates].
   */
  templateKey: string;
}
