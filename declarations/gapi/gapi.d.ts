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

  export function load(libraries: string, callback: () => void): void
}

declare namespace gapi.auth2 {
  export function getAuthInstance(): Instance

  interface Instance {
    signIn(): Promise<void>
  }
}
