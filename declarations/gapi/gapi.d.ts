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
