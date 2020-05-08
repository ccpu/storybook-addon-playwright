import { StoryAction, ActionSchemaList } from '../typings';
import { getActionSchema } from './get-schema';

export const isValidAction = (
  schema: ActionSchemaList,
  action: StoryAction,
) => {
  const actionSchema = getActionSchema(schema, action.name);

  if (!actionSchema.required) return true;

  if (!action.args) return false;

  const argKeys = Object.keys(action.args);

  if (!argKeys.length) return false;

  for (let i = 0; i < actionSchema.required.length; i++) {
    const requiredParam = actionSchema.required[i];
    const val = action.args[requiredParam];
    if (!val) {
      return false;
    }
  }

  return true;
};
