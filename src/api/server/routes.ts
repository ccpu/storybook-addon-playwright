import { ROUTE } from '../../constants/routes';
import bodyParser from 'body-parser';
import {
  getScreenshot,
  getActionsSchema,
  saveScreenshot,
  saveActionSet,
  getActionSet,
  deleteActionSet,
  getStoryScreenshots,
  deleteScreenshot,
  testScreenshot,
  testStoryScreenshots,
  testScreenshots,
  updateScreenshot,
  deleteStoryScreenshot,
  changeScreenShotIndex,
  fixScreenshotFileName,
  getSchemaController,
  getThemeData,
  addToFavourite,
  getFavouriteActions,
  deleteFavouriteAction,
} from './controller';
import { Response, Request } from 'express';

type MiddlewareRouter = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: (path: string, handler: any) => unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  use: (path: string, handler: any) => unknown;
};

const addonRoutes = Object.values(ROUTE);

const registerRouteMiddleware = (
  router: MiddlewareRouter,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  middleware: any,
) => {
  addonRoutes.forEach((route) => {
    router.use(route, middleware);
  });
};

const setInfiniteTimeout = (req, res, next) => {
  req.setTimeout(0);
  res.setTimeout(0);
  next();
};

export const asyncCatch = function (func) {
  return async function (req: Request, res: Response) {
    try {
      return await func(req, res);
    } catch (err) {
      const error = err as { status?: number; message?: string };
      res.status(error.status || 500).send({
        message:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Internal Server Error',
        status: error.status || 500,
      });
    }
  };
};

const expressMiddleWare = (router: MiddlewareRouter) => {
  registerRouteMiddleware(router, bodyParser.json({ limit: '5000mb' }));
  registerRouteMiddleware(
    router,
    bodyParser.urlencoded({ extended: true, limit: '5000mb' }),
  );
  registerRouteMiddleware(router, setInfiniteTimeout);

  router.post(ROUTE.TAKE_SCREENSHOT, asyncCatch(getScreenshot));
  router.post(ROUTE.SAVE_SCREENSHOT, asyncCatch(saveScreenshot));
  router.post(ROUTE.GET_ACTIONS_DATA, asyncCatch(getActionsSchema));
  router.post(ROUTE.SAVE_ACTION_SET, asyncCatch(saveActionSet));
  router.post(ROUTE.GET_ACTION_SET, asyncCatch(getActionSet));
  router.post(ROUTE.DELETE_ACTION_SET, asyncCatch(deleteActionSet));
  router.post(ROUTE.DELETE_ACTION_SET, asyncCatch(deleteActionSet));
  router.post(ROUTE.GET_STORY_SCREENSHOTS, asyncCatch(getStoryScreenshots));
  router.post(ROUTE.DELETE_SCREENSHOT, asyncCatch(deleteScreenshot));
  router.post(ROUTE.TEST_SCREENSHOT, asyncCatch(testScreenshot));
  router.post(ROUTE.TEST_STORY_SCREENSHOT, asyncCatch(testStoryScreenshots));
  router.post(ROUTE.TEST_SCREENSHOTS, asyncCatch(testScreenshots));
  router.post(ROUTE.UPDATE_SCREENSHOT, asyncCatch(updateScreenshot));
  router.post(ROUTE.DELETE_STORY_SCREENSHOT, asyncCatch(deleteStoryScreenshot));
  router.post(ROUTE.CHANGE_SCREENSHOT_INDEX, asyncCatch(changeScreenShotIndex));
  router.post(ROUTE.GET_SCHEMA, asyncCatch(getSchemaController));
  router.post(ROUTE.FIX_STORY_TITLE_CHANGE, asyncCatch(fixScreenshotFileName));
  router.post(ROUTE.GET_THEME, asyncCatch(getThemeData));
  router.post(ROUTE.ADD_FAVOURITE_ACTION, asyncCatch(addToFavourite));
  router.post(ROUTE.DELETE_FAVOURITE_ACTION, asyncCatch(deleteFavouriteAction));
  router.post(ROUTE.GET_FAVOURITE_ACTIONS, asyncCatch(getFavouriteActions));
};
export default expressMiddleWare;
