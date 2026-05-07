import type { ActionSet } from '../../../typings';
import { nanoid } from 'nanoid';

interface Options {
  regenerateIds?: boolean;
}

export function normalizeScreenshotActionIds(
  actionSets?: ActionSet[],
  options?: Options,
): ActionSet[] | undefined {
  if (!actionSets || !actionSets.length) {
    return undefined;
  }

  const regenerateIds = options?.regenerateIds === true;

  return actionSets.map((actionSet) => ({
    ...actionSet,
    actions: actionSet.actions.map((action) => ({
      ...action,
      id: regenerateIds ? nanoid(12) : action.id || nanoid(12),
    })),
    id: regenerateIds ? nanoid(12) : actionSet.id || nanoid(12),
  }));
}
