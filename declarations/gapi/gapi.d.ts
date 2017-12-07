declare namespace gapi {
  const client: Client

  export type ClientInitConfig = {
    apiKey?: string,
    discoveryDocs?: string[],
    clientId?: string,
    scope?: string,
  }

  export interface Client {
    init(config: ClientInitConfig): Promise<void>;

    newBatch<T>(): gapi.client.Batch<T>;
  }

  interface User {
    getAuthResponse(): gapi.auth2.AuthResponse;
  }

  export function load(libraries: string, callback: () => void): void
}

declare namespace gapi.auth2 {
  export function getAuthInstance(): Instance

  type AuthResponse = {
    access_token: string,
  }

  interface Instance {
    currentUser: {get: () => gapi.User}
    isSignedIn: {get: () => boolean}
    signIn(): Promise<void>
  }
}

declare namespace gapi.client {

  export interface Batch<T> extends PromiseLike<Response<ResponseMap<T>>> {
    add<T>(request: Request<T>, opt?: {id: string}): void;
  }

  export interface Request<T> extends PromiseLike<Response<T>> { }

  interface Response<T> {
    // The JSON-parsed result.
    result: T;

    // The raw response string.
    body: string;

    // The map of HTTP response headers.
    headers?: any[];

    // HTTP status
    status?: number;

    // HTTP status text
    statusText?: string;
  }

  type ResponseMap<T> = {[key: string]: Response<T>};
}
