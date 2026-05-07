import type { ActionSchemaList } from '../../typings';
import { getConfigs } from '../server/configs';
import actionSchema from '../server/data/action-schema.json';

export function getActionsSchema() {
  let schema = actionSchema as ActionSchemaList;

  const customSchema = getConfigs().customActionSchema;

  if (customSchema) {
    schema = { ...schema, ...customSchema };
  }
  return schema;
}
