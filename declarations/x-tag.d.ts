declare module xtag {
  interface IConfig {
    content?: string,
    events?: IEventConfig,
    lifecycle?: ILifecycleConfig,
  }

  interface IEventConfig {
    [eventName: string]: () => void
  }

  interface ILifecycleConfig {
    created?: () => void;
    inserted?: () => void;
    removed?: () => void;
    attributeChanged?: (attrName: string, oldValue: string, newValue: string) => void;
  }

  interface IInstance {
    register(name: string, config: IConfig): void
  }
}
