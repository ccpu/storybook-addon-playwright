import type { RouterOutput } from '../router';
import { trpc } from '../client';

export const getThemeData = (): Promise<
  RouterOutput['theme']['getThemeData']
> => trpc.theme.getThemeData.query();
