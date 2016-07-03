import {BaseElement} from './base-element';


/**
 * Configuration object for a custom element. Pass this to the [ElementRegistrar] to register it
 * to the DOM.
 */
export class ElementConfig {
  private provider_: () => BaseElement;
  private dependencies_: ElementConfig[];
  private name_: string;
  private templateKey_: string;

  /**
   * @hidden
   */
  constructor(
      provider: () => BaseElement,
      name: string,
      templateKey: string,
      dependencies: ElementConfig[] = []) {
    this.provider_ = provider;
    this.name_ = name;
    this.templateKey_ = templateKey;
    this.dependencies_ = dependencies;
  }

  /**
   * Array of dependant element configurations. These dependencies will be registered before this
   * configuration is registered.
   */
  get dependencies(): ElementConfig[] {
    return this.dependencies_;
  }

  /**
   * Name of the custom element. This is used as the tag name.
   */
  get name(): string {
    return this.name_;
  }

  /**
   * Function that returns a new instance of the custom element.
   */
  get provider(): () => BaseElement {
    return this.provider_;
  }

  /**
   * Key to load the template from [Templates]
   */
  get templateKey(): string {
    return this.templateKey_;
  }

  /**
   * @param provider Function that returns a new instance of the custom element.
   * @param name Name of the custom element. This is used as the tag name.
   * @param templateKey Key to load the template from [Templates].
   * @param dependencies Array of dependant element configurations. These dependencies will be
   *    registered before this configuration is registered.
   * @param cssUrl URL to load the CSS file from. This will be added as a `<style>` tag in the
   *    shadow DOM.
   * @return A new instance of ElementConfig.
   */
  public static newInstance(
      provider: () => BaseElement,
      name: string,
      templateKey: string,
      dependencies: ElementConfig[] = []): ElementConfig {
    return new ElementConfig(
        provider,
        name,
        templateKey,
        dependencies);
  }
}
