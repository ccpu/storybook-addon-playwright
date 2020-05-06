import { StoryAction } from '../../../../typings';
import * as immutableObject from 'object-path-immutable';

export const getActionOptionValue = (
  action: StoryAction,
  actionName: string,
  optionPath: string,
): undefined | unknown => {
  if (action && action.action) {
    const data = immutableObject.get(action.action, actionName);
    if (data) {
      return immutableObject.get(data, optionPath);
    }
  }
  return;
};
