import { StoryAction, ActionSchemaList } from '../typings';
import { getActionSchema } from './get-schema';

export const getActionArgs = (
  action: StoryAction,
  actionSchema: ActionSchemaList,
) => {
  const schema = getActionSchema(actionSchema, action.name);

  if (!schema) {
    throw new Error(
      `Unable to find '${action.name}', possibly this action has deprecated/removed from playwright and or from custom definitions.`,
    );
  }

  const args = Object.keys(schema.parameters).reduce((arr, actionName) => {
    const isRequired = schema.required && schema.required.includes(actionName);

    if (action && action.args && action.args[actionName] !== undefined) {
      const val = action.args[actionName];
      if (
        !isRequired &&
        val !== null &&
        (val === undefined ||
          (typeof val === 'object' && Object.keys(val).length === 0) ||
          (Array.isArray(val) && val.length === 0))
      ) {
        return arr;
      }

      arr.push(action.args[actionName]);
    } else {
      arr.push(undefined);
    }
    return arr;
  }, []);

  return args;
};
