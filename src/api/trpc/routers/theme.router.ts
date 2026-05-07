import { getThemeData } from '../../services/get-theme-data';
import { baseProcedure, router } from '../trpc';

export const themeRouter = router({
  // query: pure read, no side effects
  getThemeData: baseProcedure.query(() => getThemeData()),
});
