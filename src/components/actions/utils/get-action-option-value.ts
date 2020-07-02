import { StoryAction, ActionSchema } from '../../../typings';
import * as immutableObject from 'object-path-immutable';

export const getActionOptionValue = (
  action: StoryAction,
  optionPath: string,
  schema?: ActionSchema,
): undefined | unknown => {
  if (action && action.args) {
    return immutableObject.get(action.args, optionPath);
  }
  return schema ? schema.default : undefined;
};
