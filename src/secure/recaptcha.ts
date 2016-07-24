import {BaseListenable} from '../event/base-listenable';


export enum EventType {
  NEW_RESPONSE
}

/**
 * Wrapper for Google's ReCaptcha.
 */
class Recaptcha extends BaseListenable<EventType> {
  private grecaptcha_: ReCaptchaV2.ReCaptcha;
  private widgetId_: number;

  /**
   * @param grecaptcha The instance of ReCaptcha to use.
   * @param widgetId The ID of the widget created by ReCaptcha.
   */
  constructor(grecaptcha: ReCaptchaV2.ReCaptcha, element: HTMLElement, sitekey: string) {
    super();
    this.grecaptcha_ = grecaptcha;
    this.widgetId_ = grecaptcha.render(element, {
      callback: this.onCallback_.bind(this),
      sitekey: sitekey,
    });
  }

  /**
   * Callback called when the recaptcha has obtained a response.
   */
  private onCallback_(): void {
    this.dispatch(EventType.NEW_RESPONSE, () => {});
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
      sitekey: string): Recaptcha {
    return new Recaptcha(grecaptcha, element, sitekey);
  }
}

export default Recaptcha;
