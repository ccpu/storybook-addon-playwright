import type { RouterInput, RouterOutput } from '../router';
import { trpc } from '../client';

export const getActionsSchema = (): Promise<
  RouterOutput['schema']['getActionsSchema']
> => trpc.schema.getActionsSchema.query();

export const getSchema = (
  input: RouterInput['schema']['getSchema'],
): Promise<RouterOutput['schema']['getSchema']> =>
  trpc.schema.getSchema.mutate(input);
