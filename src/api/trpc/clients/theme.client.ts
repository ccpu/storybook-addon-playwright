import type { RouterOutput } from '../router';
import { createTrpcHttpClient } from '../client';

const client = createTrpcHttpClient();

export const getThemeData = (): Promise<
  RouterOutput['theme']['getThemeData']
> => client.theme.getThemeData.query();
