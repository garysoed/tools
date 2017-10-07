declare namespace goog {
  export class Drive {
    readonly files: goog.drive.Files;
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

  export class Files {
    list(config: ListConfig): Promise<any[]>
  }
}