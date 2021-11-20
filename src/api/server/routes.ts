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
} from './controller';
import { Router, Response, Request } from 'express';

export const asyncCatch = function (func) {
  return async function (
    req: Request,
    res: Response,
    next: (err: unknown) => void,
  ) {
    try {
      return await func(req, res);
    } catch (err) {
      next(err);
    }
  };
};

const expressMiddleWare = (router: Partial<Router>) => {
  router.use(bodyParser.json({ limit: '5000mb' }));
  router.use(bodyParser.urlencoded({ extended: true, limit: '5000mb' }));

  router.use((req, res, next) => {
    // Set the timeout for all HTTP requests
    req.setTimeout(0);
    // Set the server response timeout for all HTTP requests
    res.setTimeout(0);
    next();
  });

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  router.use((error, _req, res, next) => {
    res.status(error.status || 500).send({
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Internal Server Error',
      status: error.status || 500,
    });
    next(error);
  });
};
export default expressMiddleWare;
