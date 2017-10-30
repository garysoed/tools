declare namespace google {
  const picker: google.pickerapi.Api;
}

declare namespace google.pickerapi {
  type Api = {
    DocsView: typeof google.pickerapi.views.Docs,
    DocsViewMode: {
      GRID: google.pickerapi.views.DocsViewMode,
      LIST: google.pickerapi.views.DocsViewMode,
    },
    Feature: {
      MINE_ONLY: Feature
      MULTISELECT_ENABLED: Feature
      NAV_HIDDEN: Feature
      SIMPLE_UPLOAD_ENABLED: Feature
      SUPPORT_TEAM_DRIVES: Feature
    },
    PickerBuilder: typeof PickerBuilderType,
    ViewId: {
      DOCS: ViewId,
      DOCS_IMAGES: ViewId,
      DOCS_IMAGES_AND_VIDEOS: ViewId,
      DOCS_VIDEOS: ViewId,
      DOCUMENTS: ViewId,
      DRAWINGS: ViewId,
      FOLDERS: ViewId,
      FORMS: ViewId,
      IMAGE_SEARCH: ViewId,
      PDFS: ViewId,
      PHOTO_ALBUMS: ViewId,
      PHOTO_UPLOAD: ViewId,
      PHOTOS: ViewId,
      PRESENTATIONS: ViewId,
      RECENTLY_PICKED: ViewId,
      SPREADSHEETS: ViewId,
      VIDEO_SEARCH: ViewId,
      WEBCAM: ViewId,
      YOUTUBE: ViewId,
    }
  };

  type Result = { };
  type View = google.pickerapi.views.Base;
  type ViewId = google.pickerapi.views.Id;

  interface Feature { }

  class Picker {
    setVisible(visible: boolean): void;
  }

  class PickerBuilderType {
    addView(view: View | ViewId): this;
    addViewGroup(viewGroup: ViewGroup): this;
    build(): Picker;
    disableFeature(feature: Feature): this;
    enableFeature(feature: Feature): this;
    getRelayUrl(): string;
    getTitle(): string;
    hideTitleBar(): this;
    isFeatureEnabled(feature: Feature): boolean;
    setAppId(id: string): this;
    setCallback(callback: (result: Result) => any): this;
    setDeveloperKey(key: string): this;
    setDocument(documnet: Document): this;
    setLocale(locale: string): this;
    setMaxItems(count: number): this;
    setOAuthToken(token: string): this;
  }

  class ViewGroup {
    constructor(root: View | ViewId);

    addLabel(label: string): this;
    addView(view: View | ViewId): this;
    addViewGroup(viewGroup: ViewGroup): this;
  }
}

declare namespace google.pickerapi.views {
  interface DocsViewMode { }
  interface Id { }

  class Base {
    constructor(id: Id);

    getId(): Id;
    setMimeTypes(mimeTypes: string): this;
    setQuery(query: string): this;
  }

  class Docs extends Base {
    constructor(id?: Id);

    setEnableTeamDrives(enable: boolean): this;
    setIncludeFolders(include: boolean): this;
    setSelectFolderEnabled(enable: boolean): this;
    setMode(mode: DocsViewMode): this;
    setOwnedByMe(owned?: boolean): this;
    setParent(parentFolder: string): this;
    setStarred(starred: boolean): this;
  }
}
