import BaseDisposable from '../dispose/base-disposable';
import ListenableElement, {EventType as ListenableElementEventType} from
    '../event/listenable-element';
import {Records} from '../collection/records';

/**
 * Base class for all HTTP requests.
 */
abstract class HttpRequest extends BaseDisposable {
  /**
   * The XMLHttpRequest object wrapped as a [[ListenableElement]]
   */
  protected listenableRequest: ListenableElement<XMLHttpRequest>;

  /**
   * The XMLHttpRequest object.
   */
  protected request: XMLHttpRequest;

  /**
   * @param method The HTTP method to send.
   * @param path The path to send the request to.
   */
  constructor(method: string, path: string) {
    super();
    this.request = new XMLHttpRequest();
    this.listenableRequest = new ListenableElement(this.request);

    this.request.open(method, path);

    this.addDisposable(this.listenableRequest);
  }

  /**
   * @return The data to be sent.
   */
  protected get sentData(): string {
    return null;
  }

  /**
   * Sends the HTTP request.
   *
   * @return Promise that will be resolved with the response text if successful, or rejected with
   *    the XMLHttpRequest request object otherwise.
   */
  send(): Promise<string> {
    return new Promise<string>((resolve: (param: any) => void, reject: (error: any) => void) => {
      this.addDisposable(this.listenableRequest.on(ListenableElementEventType.LOAD, () => {
        if (this.request.status === 200) {
          resolve(this.request.responseText);
        } else {
          reject(this.request);
        }
        this.dispose();
      }));
      this.request.send(this.sentData);
    });
  }
}

class HttpGetRequest extends HttpRequest {
  constructor(path: string) {
    super('GET', path);
  }
}

/**
 * Represents an HTTP POST request.
 */
class HttpPostRequest extends HttpRequest {
  private formData_: string;

  /**
   * @param path Path to send the request to.
   */
  constructor(path: string) {
    super('POST', path);
    this.request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }

  /**
   * @return The data to be sent.
   */
  protected get sentData(): string {
    return this.formData_;
  }

  /**
   * Sets the form data to be sent.
   *
   * @param data JSON representation of the form data to be sent. The key corresponds to each form
   *    field.
   * @return This object for chaining.
   */
  setFormData(data: gs.IJson): HttpPostRequest {
    // Clears all the existing form data
    this.formData_ = Records.of(data)
        .mapValue((value: string, key: string) => {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .values()
        .asArray()
        .join('&')
        .replace(/%20/g, '+');

    return this;
  }
}

/**
 * Utility to make HTTP requests.
 *
 * Base use case is to start with the [[Http]] object, set all the parameters, and call [[send]].
 * The send will send the request and return a Promise. For example:
 *
 * ```typescript
 * import Http from './net/http';
 *
 * Http.post('http://path')
 *     .setFormData({
 *       'cost': '$2',
 *       'food': 'ice cream'
 *     })
 *     .send()
 *     .then((response: string) => {
 *       // Do something with the response
 *     });
 * ```
 */
class Http {
  /**
   * Starts to send an HTTP GET request.
   *
   * @param path The path to send the request to.
   * @return HTTP GET request object for setting up and sending the request.
   */
  static get(path: string): HttpGetRequest {
    return new HttpGetRequest(path);
  }

  /**
   * Starts to send an HTTP POST request.
   *
   * @param path The path to send the request to.
   * @return HTTP POST request object for setting up and sending the request.
   */
  static post(path: string): HttpPostRequest {
    return new HttpPostRequest(path);
  }
}

export default Http;
