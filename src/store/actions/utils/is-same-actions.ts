import { StoryAction } from '../../../typings';
import equal from 'fast-deep-equal';

export const isSameActions = (
  a: Partial<StoryAction>[],
  b: Partial<StoryAction>[],
) => {
  if (a.length !== b.length) return false;

  const newA = [...a].map((action) => {
    delete action.id;
    return action;
  });

  return equal(newA, b);
};
