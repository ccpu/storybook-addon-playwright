import { ActionSchemaList } from '../../../typings';
import { getConfigs } from '../configs';
import actionSchema from '../data/action-schema.json';

export const getActionsSchema = () => {
  let schema = actionSchema as ActionSchemaList;

  const customSchema = getConfigs().customActionSchema;

  if (customSchema) {
    schema = { ...schema, ...customSchema };
  }
  return schema;
};
