declare module xtag {
  interface IAttributeConfig {
    boolean?: boolean
    property?: string
    validate?: (value: any) => boolean
  }

  interface IAccessorConfig {
    attribute?: IAttributeConfig
    get?: () => any
    set?: (value) => void
  }

  interface IConfig {
    accessors?: {[name: string]: IAttributeConfig}
    content?: string
    events?: IEventConfig
    lifecycle?: ILifecycleConfig
  }

  interface IEventConfig {
    [eventName: string]: () => void
  }

  interface ILifecycleConfig {
    created?: () => void
    inserted?: () => void
    removed?: () => void
    attributeChanged?: (attrName: string, oldValue: string, newValue: string) => void
  }

  interface IInstance {
    register(name: string, config: IConfig): void
  }
}
