import type { Definition } from 'ts-to-json';

export type ActionSchema = Definition;

export interface ActionSchemaList {
  [key: string]: ActionSchema;
}
