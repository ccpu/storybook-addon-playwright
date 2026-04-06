import { router, baseProcedure } from '../trpc';
import { getThemeData } from '../../services/get-theme-data';

export const themeRouter = router({
  // query: pure read, no side effects
  getThemeData: baseProcedure.query(() => getThemeData()),
});
