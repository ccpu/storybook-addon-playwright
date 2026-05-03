import type { RouterInput, RouterOutput } from '../router';
import { createTrpcHttpClient } from '../client';

const client = createTrpcHttpClient();

export const saveActionSet = (
  input: RouterInput['actionSet']['saveActionSet'],
): Promise<RouterOutput['actionSet']['saveActionSet']> =>
  client.actionSet.saveActionSet.mutate(input);

export const getActionSet = (
  input: RouterInput['actionSet']['getActionSet'],
): Promise<RouterOutput['actionSet']['getActionSet']> =>
  client.actionSet.getActionSet.mutate(input);

export const deleteActionSet = (
  input: RouterInput['actionSet']['deleteActionSet'],
): Promise<RouterOutput['actionSet']['deleteActionSet']> =>
  client.actionSet.deleteActionSet.mutate(input);
