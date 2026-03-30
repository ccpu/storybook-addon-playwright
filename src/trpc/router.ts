import { router } from './trpc';
import { screenshotRouter } from '../features/screenshot/screenshot.router';
import { actionSetRouter } from '../features/action-set/action-set.router';
import { favouriteActionsRouter } from '../features/favourite-actions/favourite-actions.router';
import { schemaRouter } from '../features/schema/schema.router';
import { themeRouter } from '../features/theme/theme.router';
import { fixTitleRouter } from '../features/fix-title/fix-title.router';

export const appRouter = router({
  actionSet: actionSetRouter,
  favouriteActions: favouriteActionsRouter,
  fixTitle: fixTitleRouter,
  schema: schemaRouter,
  screenshot: screenshotRouter,
  theme: themeRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInput = import('@trpc/server').inferRouterInputs<AppRouter>;
export type RouterOutput = import('@trpc/server').inferRouterOutputs<AppRouter>;
