import { Definition } from 'ts-to-json';

export type ActionSchema = Pick<
  Definition,
  | 'properties'
  | 'required'
  | 'parameters'
  | 'description'
  | 'items'
  | 'type'
  | 'enum'
  | 'title'
>;

export type ActionSchemaList = {
  [key: string]: ActionSchema;
};

export interface CustomActionListSchema {
  [key: string]: Omit<ActionSchema, 'parameters'>;
}
