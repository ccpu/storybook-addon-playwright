import { trpc } from '../../trpc/client';
import type { RouterOutput } from '../../trpc/router';

export const getThemeData = (): Promise<
  RouterOutput['theme']['getThemeData']
> => trpc.theme.getThemeData.query();
