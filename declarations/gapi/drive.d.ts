declare namespace goog {
  export class Drive {
    readonly files: goog.drive.files.Api;
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
  type Capabilities = {
    canAddChildren: boolean,
    canChangeViewersCanCopyContent: boolean,
    canComment: boolean,
    canCopy: boolean,
    canDelete: boolean,
    canDownload: boolean,
    canEdit: boolean,
    canListChildren: boolean,
    canMoveItemIntoTeamDrive: boolean,
    canMoveTeamDriveItem: boolean,
    canReadRevisions: boolean,
    canReadTeamDrive: boolean,
    canRemoveChildren: boolean,
    canRename: boolean,
    canShare: boolean,
    canTrash: boolean,
    canUntrash: boolean,
  };

  type User = {
    kind: 'drive#user',
    displayName: string,
    photoLink: string,
    me: boolean,
    permissionId: string,
    emailAddress: string,
  };
}

declare namespace goog.drive.files {
  type File = {
    kind: 'drive#file',
    id: string,
    name: string,
    mimeType: string,
    description?: string,
    starred?: boolean,
    trashed?: boolean,
    explicitlyTrashed?: boolean,
    trashingUser?: goog.drive.User,
    trashedTime?: string,
    parents?: string[],
    properties?: {[key: string]: string},
    appProperties?: {[key: string]: string},
    spaces?: string[],
    version?: number,
    webContentLink?: string,
    webViewLink?: string,
    iconLink?: string,
    hasThumbnail?: boolean,
    thumbnailLink?: string,
    thumbnailVersion?: number,
    viewedByMe?: boolean,
    viewedByMeTime?: string,
    createdTime?: string,
    modifiedTime?: string,
    modifiedByMeTime?: string,
    modifiedByMe?: boolean,
    sharedWithMeTime?: string,
    sharingUser?: goog.drive.User,
    owners?: goog.drive.User[],
    teamDriveId?: string,
    lastModifyingUser?: goog.drive.User,
    shared?: boolean,
    ownedByMe?: boolean,
    capabilities?: goog.drive.Capabilities,
    viewersCanCopyContent?: boolean,
    writersCanShare?: boolean,
    permissions?: goog.drive.permissions.Permission[],
    hasAugmentedPermissions?: boolean,
    folderColorRgb?: string,
    originalFilename?: string,
    fullFileExtension?: string,
    fileExtension?: string,
    md5Checksum?: string,
    size?: number,
    quotaBytesUsed?: number,
    headRevisionId?: string,
    contentHints?: {
      thumbnail: {
        image: string, // TODO: Check what this is
        mimeType: string
      },
      indexableText: string,
    },
    imageMediaMetadata?: {
      width: number,
      height: number,
      rotation: number,
      location: {
        latitude: number,
        longitude: number,
        altitude: number,
      },
      time: string,
      cameraMake: string,
      cameraModel: string,
      exposureTime: number,
      aperture: number,
      flashUsed: boolean,
      focalLength: number,
      isoSpeed: number,
      meteringMode: string,
      sensor: string,
      exposureMode: string,
      colorSpace: string,
      whiteBalance: string,
      exposureBias: number,
      maxApertureValue: number,
      subjectDistance: number,
      lens: string
    },
    videoMediaMetadata?: {
      width: number,
      height: number,
      durationMillis: number,
    },
    isAppAuthorized?: boolean,
  };

  type GetConfig = {
    acknowledgeAbuse?: boolean,
    alt?: 'media',
    fileId: string,
    supportsTeamDrives?: boolean,
  };

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

  type ListResponse = {
    readonly kind: 'drive#fileList',
    readonly nextPageToken: string,
    readonly files: File[],
    readonly incompleteSearch: boolean,
  };

  export class Api {
    get(config: GetConfig): Promise<goog.Response<File>>
    list(config: ListConfig): Promise<goog.Response<ListResponse>>
  }
}

declare namespace goog.drive.permissions {
  type Permission = {
    kind: 'drive#permission',
    id: string,
    type: string,
    emailAddress: string,
    domain: string,
    role: string,
    allowFileDiscovery: boolean,
    displayName: string,
    photoLink: string,
    expirationTime: string,
    teamDrivePermissionDetails: [
      {
        teamDrivePermissionType: string,
        role: string,
        inheritedFrom: string,
        inherited: boolean
      }
    ],
    deleted: boolean
  };
}