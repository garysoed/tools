import Arrays from '../collection/arrays';
import BaseDisposable from '../dispose/base-disposable';
import ListenableElement, {EventType as ListenableElementEventType} from
    '../event/listenable-element';
import Records from '../collection/records';

abstract class HttpRequest extends BaseDisposable {
  protected listenableRequest: ListenableElement;
  protected request: XMLHttpRequest;

  constructor(method: string, path: string) {
    super();
    this.request = new XMLHttpRequest();
    this.listenableRequest = new ListenableElement(this.request);

    this.request.open(method, path);

    this.addDisposable(this.listenableRequest);
  }

  protected get sentData(): string {
    return null;
  }

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

class HttpPostRequest extends HttpRequest {
  private formData_: string;

  constructor(path: string) {
    super('POST', path);
    this.request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }

  protected get sentData(): string {
    return this.formData_;
  }

  setFormData(data: gs.IJson): HttpPostRequest {
    // Clears all the existing form data
    this.formData_ = Arrays
        .fromRecordValues(
            Records.of(data)
                .mapValue((value: string, key: string) => {
                  return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                })
                .data)
        .data
        .join('&')
        .replace(/%20/g, '+');

    return this;
  }
}

export default {
  post(path: string): HttpPostRequest {
    return new HttpPostRequest(path);
  },
}
