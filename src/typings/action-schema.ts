import { Definition } from 'ts-to-json';

export type ActionSchema = Definition;

export type ActionSchemaList = {
  [key: string]: ActionSchema;
};
