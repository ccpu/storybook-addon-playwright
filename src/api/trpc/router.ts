import {
  actionSetRouter,
  favouriteActionsRouter,
  fixTitleRouter,
  schemaRouter,
  screenshotRouter,
  themeRouter,
} from './routers';
import { router } from './trpc';

export { getConfigs, setConfig } from '../server/configs';

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
