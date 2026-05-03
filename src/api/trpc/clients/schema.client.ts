import type { RouterInput, RouterOutput } from '../router';
import { createTrpcHttpClient } from '../client';

const client = createTrpcHttpClient();

export const getActionsSchema = (): Promise<
  RouterOutput['schema']['getActionsSchema']
> => client.schema.getActionsSchema.query();

export const getSchema = (
  input: RouterInput['schema']['getSchema'],
): Promise<RouterOutput['schema']['getSchema']> =>
  client.schema.getSchema.mutate(input);
