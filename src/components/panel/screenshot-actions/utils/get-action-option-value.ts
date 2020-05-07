import { StoryAction } from '../../../../typings';
import * as immutableObject from 'object-path-immutable';

export const getActionOptionValue = (
  action: StoryAction,
  optionPath: string,
): undefined | unknown => {
  if (action && action.data) {
    return immutableObject.get(action.data, optionPath);
  }
  return;
};
