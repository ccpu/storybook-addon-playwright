import { StoryAction } from '../../../typings';
import equal from 'fast-deep-equal';

function actionsWithoutId(actions: Partial<StoryAction>[]) {
  return actions.map((action) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = action;
    return rest;
  });
}

export const isSameActions = (
  a: Partial<StoryAction>[],
  b: Partial<StoryAction>[],
) => {
  if (a.length !== b.length) return false;

  const newA = actionsWithoutId(a);

  const newB = actionsWithoutId(b);

  return equal(newA, newB);
};
