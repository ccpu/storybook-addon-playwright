import { StoryAction } from '../../../typings';
import * as immutableObject from 'object-path-immutable';

export const getActionOptionValue = (
  action: StoryAction,
  optionPath: string,
): undefined | unknown => {
  if (action && action.args) {
    return immutableObject.get(action.args, optionPath);
  }
  return;
};
