// types/messages.types.ts
export interface IMessageTemplate {
  readonly [key: string]: string;
}

export interface IMessagesCollection {
  errors: IMessageTemplate;
  success: IMessageTemplate;
  info?: IMessageTemplate;
}

export interface IModuleMessages<T extends string, S extends string> {
  errors: Record<T, string>;
  success: Record<S, string>;
}