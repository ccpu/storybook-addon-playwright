import { StoryAction, ActionSchemaList } from '../typings';
import { getActionSchema } from './get-schema';

export const sortActionArgs = (
  action: StoryAction,
  actionSchema: ActionSchemaList,
) => {
  const schema = getActionSchema(actionSchema, action.name);

  if (!schema) {
    console.error(
      `Unable to find '${action.name}', possibly this action has deprecated/removed from playwright.`,
    );
    return action;
  }

  const sortedData = Object.keys(schema.parameters).reduce(
    (obj, actionName) => {
      if (action && action.args && action.args[actionName]) {
        obj[actionName] = action.args[actionName];
      } else {
        obj[actionName] = null;
      }
      return obj;
    },
    {},
  );

  action.args = sortedData;
  return action;
};

export const sortActionListArgs = (
  schema: ActionSchemaList,
  actions: StoryAction[],
) => {
  const sortedActions = actions.reduce((arr, action) => {
    const sortedAction = sortActionArgs(action, schema);
    arr.push(sortedAction);
    return arr;
  }, [] as StoryAction[]);

  return sortedActions;
};
