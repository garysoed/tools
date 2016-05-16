import {BaseElement} from './base-element';


/**
 * Configuration object for a custom element. Pass this to the [ElementRegistrar] to register it
 * to the DOM.
 */
export class ElementConfig {
  private cssUrl_: string;
  private provider_: () => BaseElement;
  private dependencies_: ElementConfig[];
  private name_: string;
  private templateUrl_: string;

  /**
   * @hidden
   */
  constructor(
      provider: () => BaseElement,
      name: string,
      templateUrl: string,
      dependencies: ElementConfig[] = [],
      cssUrl: string = null) {
    this.provider_ = provider;
    this.name_ = name;
    this.templateUrl_ = templateUrl;
    this.dependencies_ = dependencies;
    this.cssUrl_ = cssUrl;
  }

  /**
   * URL to load the CSS file from. This will be added as a `<style>` tag in the shadow DOM.
   */
  get cssUrl(): string {
    return this.cssUrl_;
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
   * URL to load the HTML shadow DOM content of the custom element.
   */
  get templateUrl(): string {
    return this.templateUrl_;
  }

  /**
   * @param provider Function that returns a new instance of the custom element.
   * @param name Name of the custom element. This is used as the tag name.
   * @param templateUrl URL to load the HTML shadow DOM content of the custom element.
   * @param dependencies Array of dependant element configurations. These dependencies will be
   *    registered before this configuration is registered.
   * @param cssUrl URL to load the CSS file from. This will be added as a `<style>` tag in the
   *    shadow DOM.
   * @return A new instance of ElementConfig.
   */
  public static newInstance(
      provider: () => BaseElement,
      name: string,
      templateUrl: string,
      dependencies: ElementConfig[] = [],
      cssUrl: string = null): ElementConfig {
    return new ElementConfig(
        provider,
        name,
        templateUrl,
        dependencies,
        cssUrl);
  }
}
