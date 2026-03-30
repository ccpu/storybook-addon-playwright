import { router, baseProcedure } from '../../trpc/trpc';
import { getThemeData } from './theme.service';

export const themeRouter = router({
  // query: pure read, no side effects
  getThemeData: baseProcedure.query(() => getThemeData()),
});
