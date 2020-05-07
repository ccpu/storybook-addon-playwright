import { StoryAction, ActionSchemaList } from '../typings';
import { getActionSchema } from './get-schema';

export const getActionArgs = (
  action: StoryAction,
  actionSchema: ActionSchemaList,
) => {
  const schema = getActionSchema(actionSchema, action.name);

  if (!schema) {
    throw new Error(
      `Unable to find '${action.name}', possibly this action has deprecated/removed from playwright.`,
    );
  }

  const args = Object.keys(schema.parameters).reduce((arr, actionName) => {
    if (action && action.args && action.args[actionName]) {
      arr.push(action.args[actionName]);
    } else {
      arr.push([undefined]);
    }
    return arr;
  }, []);

  return args;
};
