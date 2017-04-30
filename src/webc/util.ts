export const Util = {
  /**
   * Gets the target element according to the given config.
   *
   * @param config The configuration to use to get the target element.
   * @param element The root of the element.
   * @return The target element.
   */
  resolveSelector(
      selector: string | null, parentElement: HTMLElement): Element | null {
    if (selector === null || parentElement.shadowRoot === null) {
      return parentElement;
    } else {
      return parentElement.shadowRoot.querySelector(selector);
    }
  },
};
