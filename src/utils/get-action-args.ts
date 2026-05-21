import type { ActionSchemaList, StoryAction } from '../typings';
import { getActionSchema } from './get-schema';
import { normalizeActionArgs } from './normalize-action-args';

export function getActionArgs(action: StoryAction, actionSchema: ActionSchemaList) {
  const schema = getActionSchema(actionSchema, action.name);

  if (!schema) {
    throw new Error(
      `Unable to find '${action.name}', possibly this action has deprecated/removed from playwright and or from custom definitions.`,
    );
  }

  const parameters = (schema.parameters as Record<string, unknown> | undefined) || {};
  const normalizedArgs = normalizeActionArgs(action.args, schema);

  const args = Object.keys(parameters).reduce<unknown[]>((arr, actionName) => {
    const isRequired = schema.required && schema.required.includes(actionName);
    const hasRawArg = action.args && Object.keys(action.args).includes(actionName);

    if (normalizedArgs && normalizedArgs[actionName] !== undefined) {
      arr.push(normalizedArgs[actionName]);
    } else if (hasRawArg && !isRequired) {
      return arr;
    } else {
      arr.push(undefined);
    }
    return arr;
  }, []);

  return args;
}
