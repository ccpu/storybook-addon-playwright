import { StoryAction } from '../../../../typings';

export function getActionOptions<T>(action?: StoryAction): T | undefined {
  if (!action || !action.args || action.args.options) return undefined;
  const options = action.args && action.args.options;
  return options as T;
}
