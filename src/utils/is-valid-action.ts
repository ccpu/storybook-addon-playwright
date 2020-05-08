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

  for (let i = 0; i < argKeys.length; i++) {
    const argName = argKeys[i];
    const val = action.args[argName];
    if (actionSchema.required.includes(argName) && !val) {
      return false;
    }
  }

  return true;
};
