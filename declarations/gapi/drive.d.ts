declare namespace goog {
  export class Drive {
    readonly files: goog.drive.Files;
  }

  export type Response<T> = {
    readonly body: string,
    readonly headers: {},
    readonly result: T,
    readonly status: number,
    readonly statusText: string | null,
  }
}

declare namespace goog.drive {
  type ListConfig = {
    corpora?: string,
    corpus?: 'domain' | 'user',
    includeTeamDriveItems?: boolean,
    orderBy?: string,
    pageSize?: number,
    pageToken?: string,
    q?: string,
    spaces?: string,
    supportsTeamDrives?: boolean,
    teamDriveId?: string,
  };

  export type ListFile = {
    readonly kind: 'drive#file',
    readonly id: string,
    readonly name: string,
    readonly mimeType: string,
  };

  type ListResponse = {
    readonly kind: 'drive#fileList',
    readonly nextPageToken: string,
    readonly files: ListFile[],
    readonly incompleteSearch: boolean,
  };

  export class Files {
    list(config: ListConfig): Promise<goog.Response<ListResponse>>
  }
}