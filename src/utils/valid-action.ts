import type { ActionSchemaList, StoryAction } from '../typings';
import { getActionSchema } from './get-schema';

export interface ValidationResult {
  required?: string[];
}

export interface ActionListValidationResult extends ValidationResult {
  id: string;
  name: string;
}

export function validAction(
  schema: ActionSchemaList,
  action: StoryAction,
): ValidationResult {
  const actionSchema = getActionSchema(schema, action.name);

  if (!actionSchema || !actionSchema.required || !actionSchema.required.length)
    return {};

  if (!action.args) {
    return { required: actionSchema.required };
  }

  const argKeys = Object.keys(action.args);

  if (argKeys.length === 0) {
    return { required: actionSchema.required };
  }

  const requiredParams: string[] = [];

  for (let i = 0; i < actionSchema.required.length; i++) {
    const requiredParam = actionSchema.required[i];
    const val = action.args[requiredParam];
    if (!val) {
      requiredParams.push(requiredParam);
    }
  }

  return {
    required: requiredParams.length === 0 ? undefined : requiredParams,
  };
}

export function isValidAction(schema: ActionSchemaList, action: StoryAction) {
  const result = validAction(schema, action);

  return result.required === undefined;
}

export function validateActionList(
  schema: ActionSchemaList,
  actions: StoryAction[],
) {
  const result = actions.reduce<ActionListValidationResult[]>((arr, action) => {
    const res = validAction(schema, action);
    if (res.required) {
      arr.push({
        id: action.id,
        name: action.name,
        ...res,
      });
    }
    return arr;
  }, []);
  return result.length === 0 ? undefined : result;
}
