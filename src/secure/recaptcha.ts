/**
 * Wrapper for Google's ReCaptcha.
 */
class Recaptcha {
  private grecaptcha_: ReCaptchaV2.ReCaptcha;
  private widgetId_: number;

  /**
   * @param grecaptcha The instance of ReCaptcha to use.
   * @param widgetId The ID of the widget created by ReCaptcha.
   */
  constructor(grecaptcha: ReCaptchaV2.ReCaptcha, widgetId: number) {
    this.grecaptcha_ = grecaptcha;
    this.widgetId_ = widgetId;
  }

  /**
   * Resets the ReCaptcha widget instance.
   */
  reset(): void {
    this.grecaptcha_.reset(this.widgetId_);
  }

  /**
   * The ReCaptcha response from the widget.
   */
  get response(): string {
    return this.grecaptcha_.getResponse(this.widgetId_);
  }

  /**
   * Creates a new ReCaptcha widget instance.
   * @param grecaptcha The ReCaptcha instance to use.
   * @param element The element to attach the widget to.
   * @param params The ReCaptcha parameters.
   * @return New instance of ReCaptcha widget.
   */
  static newInstance(
      grecaptcha: ReCaptchaV2.ReCaptcha,
      element: HTMLElement,
      params: ReCaptchaV2.Parameters): Recaptcha {
    return new Recaptcha(grecaptcha, grecaptcha.render(element, params));
  }
}

export default Recaptcha;
