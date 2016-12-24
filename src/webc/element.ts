import {Validate} from 'src/valid/validate';
import {BaseElement} from 'src/webc/base-element';


const __CONFIG = Symbol('config');

/**
 * Configures a element.
 */
type IElementConfig = {
  /**
   * URL of the CSS file, if any.
   *
   * The content of the CSS file will be appended to the template in a `<style>` element.
   */
  cssUrl?: string,

  /**
   * Element constructor of the dependencies.
   */
  dependencies?: gs.ICtor<any>[],

  /**
   * Tag name of the element.
   */
  tag: string,

  /**
   * ID that corresponds to the template.
   */
  templateId: string,

  /**
   * URL of the template.
   */
  templateUrl: string,
};


/**
 * Interface for the annotation.
 *
 * See [[Element]] for more documentation.
 */
interface IElement {
  /**
   * Annotates the class to indicate that it is a element class.
   *
   * @param config The element configuration object.
   */
  (config: IElementConfig): ClassDecorator;

  /**
   * Getss the configuration of the given element.
   *
   * @param ctor Constructor of the element class whose configuration should be returned.
   */
  getConfig(ctor: gs.ICtor<BaseElement>): IElementConfig;
}

/**
 * Annotates a class as a custom element.
 *
 * To create a new element class, you need to do the following:
 *
 * 1.  Create a new class extending [[BaseElement]].
 * 1.  Create an html file containing the element's template. This will be used as the content
 *     of the element.
 * 1.  Annotate the class with this annotation. Set the tag name and template URL of the file
 *     created in the previous step.
 * 1.  In the [[GameConfig]] object, return the configName as part of the elementConfigList.
 *
 * For example:
 *
 * ```typescript
 * import bootstrap from './game/bootstrap';
 * import Element from './util/a-element';
 *
 * \@Element({
 *   tag: 'custom-element',
 *   templateUrl: 'custom-element.html'
 * })
 * class CustomElement {
 *   // ...
 * }
 *
 * bootstrap({
 *   elementConfigList: [
 *     Element.getConfigName(CustomElement)
 *   ]
 * });
 * ```
 *
 * In your main html file, you can do:
 *
 * ```html
 * <body>
 *   <custom-element></custom-element>
 * </body>
 * ```
 *
 * @param config The configuration object.
 */
export const Element: IElement = <any> function(config: IElementConfig): ClassDecorator {
  return function<C extends gs.ICtor<any>>(ctor: C): void {
    Validate.ctor(ctor).to.extend(BaseElement)
        .orThrows(`${ctor.name} should extend BaseElement`);
    Validate.string(config.tag).toNot.beEmpty()
        .orThrows(`Configuration for ${ctor.name} should have a non empty tag name`);
    Validate.string(config.templateUrl).toNot.beEmpty()
        .orThrows(`Configuration for ${ctor.name} should have a non empty template URL`);
    ctor[__CONFIG] = config;
  };
};

Element.getConfig = function(ctor: gs.ICtor<BaseElement>): IElementConfig {
  return ctor[__CONFIG];
};
