import { trpc } from '../../trpc/client';
import type { RouterInput, RouterOutput } from '../../trpc/router';

export const saveActionSet = (
  input: RouterInput['actionSet']['saveActionSet'],
): Promise<RouterOutput['actionSet']['saveActionSet']> =>
  trpc.actionSet.saveActionSet.mutate(input);

export const getActionSet = (
  input: RouterInput['actionSet']['getActionSet'],
): Promise<RouterOutput['actionSet']['getActionSet']> =>
  trpc.actionSet.getActionSet.mutate(input);

export const deleteActionSet = (
  input: RouterInput['actionSet']['deleteActionSet'],
): Promise<RouterOutput['actionSet']['deleteActionSet']> =>
  trpc.actionSet.deleteActionSet.mutate(input);
