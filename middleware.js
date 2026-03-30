const bodyParser = require('body-parser');
const controllers = require('./dist/api/server/controller');
const { ROUTE } = require('./dist/constants/routes');

const addonRoutes = Object.values(ROUTE);

function registerAddonMiddleware(router, middleware) {
  addonRoutes.forEach((route) => {
    router.use(route, middleware);
  });
}

function parseJsonBody(req, res, next) {
  if (req.body || req.method !== 'POST') {
    next();
    return;
  }

  const contentType = req.headers['content-type'] || '';

  if (!contentType.includes('application/json')) {
    next();
    return;
  }

  let rawBody = '';

  req.on('data', (chunk) => {
    rawBody += chunk.toString();
  });

  req.on('end', () => {
    if (!rawBody) {
      req.body = {};
      next();
      return;
    }

    try {
      req.body = JSON.parse(rawBody);
      next();
    } catch (error) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Invalid JSON body', status: 400 }));
    }
  });

  req.on('error', () => {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Invalid request body', status: 400 }));
  });
}

// SB8 uses polka (not Express) for its dev server. Polka passes a raw
// http.ServerResponse without Express helpers, so we shim them here.
function addExpressCompat(req, res, next) {
  if (!res.status) {
    res.status = function (code) {
      this.statusCode = code;
      return this;
    };
  }
  if (!res.json) {
    res.json = function (data) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(data));
      return this;
    };
  }
  if (!res.send) {
    res.send = function (data) {
      if (Buffer.isBuffer(data) || ArrayBuffer.isView(data)) {
        this.end(data);
        return this;
      }
      if (data !== null && typeof data === 'object') {
        this.setHeader('Content-Type', 'application/json');
        this.end(JSON.stringify(data));
      } else {
        this.end(String(data));
      }
      return this;
    };
  }
  next();
}

function wrapPostHandler(handler) {
  return function wrappedPostHandler(req, res, next) {
    addExpressCompat(req, res, () => {
      const runHandler = () => Promise.resolve(handler(req, res, next));
      const runJsonParser = () => parseJsonBody(req, res, runHandler);

      bodyParser.json({ limit: '5000mb' })(req, res, (jsonError) => {
        if (jsonError) {
          runJsonParser();
          return;
        }

        bodyParser.urlencoded({ extended: true, limit: '5000mb' })(
          req,
          res,
          () => {
            req.setTimeout(0);
            res.setTimeout(0);
            runJsonParser();
          },
        );
      });
    });
  };
}

function asyncCatch(func) {
  return async function wrappedAsyncHandler(req, res) {
    try {
      return await func(req, res);
    } catch (err) {
      const error = err || {};

      console.error('[storybook-addon-playwright]', error);

      res.status(error.status || 500).send({
        message:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Internal Server Error',
        status: error.status || 500,
      });
    }
  };
}

module.exports = function (router) {
  const originalPost = router.post.bind(router);

  router.post = function patchedPost(path, ...handlers) {
    return originalPost(
      path,
      ...handlers.map((handler) => wrapPostHandler(handler)),
    );
  };

  router.post(ROUTE.TAKE_SCREENSHOT, asyncCatch(controllers.getScreenshot));
  router.post(ROUTE.SAVE_SCREENSHOT, asyncCatch(controllers.saveScreenshot));
  router.post(ROUTE.GET_ACTIONS_DATA, asyncCatch(controllers.getActionsSchema));
  router.post(ROUTE.SAVE_ACTION_SET, asyncCatch(controllers.saveActionSet));
  router.post(ROUTE.GET_ACTION_SET, asyncCatch(controllers.getActionSet));
  router.post(ROUTE.DELETE_ACTION_SET, asyncCatch(controllers.deleteActionSet));
  router.post(
    ROUTE.GET_STORY_SCREENSHOTS,
    asyncCatch(controllers.getStoryScreenshots),
  );
  router.post(
    ROUTE.DELETE_SCREENSHOT,
    asyncCatch(controllers.deleteScreenshot),
  );
  router.post(ROUTE.TEST_SCREENSHOT, asyncCatch(controllers.testScreenshot));
  router.post(
    ROUTE.TEST_STORY_SCREENSHOT,
    asyncCatch(controllers.testStoryScreenshots),
  );
  router.post(ROUTE.TEST_SCREENSHOTS, asyncCatch(controllers.testScreenshots));
  router.post(
    ROUTE.UPDATE_SCREENSHOT,
    asyncCatch(controllers.updateScreenshot),
  );
  router.post(
    ROUTE.DELETE_STORY_SCREENSHOT,
    asyncCatch(controllers.deleteStoryScreenshot),
  );
  router.post(
    ROUTE.CHANGE_SCREENSHOT_INDEX,
    asyncCatch(controllers.changeScreenShotIndex),
  );
  router.post(ROUTE.GET_SCHEMA, asyncCatch(controllers.getSchemaController));
  router.post(
    ROUTE.FIX_STORY_TITLE_CHANGE,
    asyncCatch(controllers.fixScreenshotFileName),
  );
  router.post(ROUTE.GET_THEME, asyncCatch(controllers.getThemeData));
  router.post(
    ROUTE.ADD_FAVOURITE_ACTION,
    asyncCatch(controllers.addToFavourite),
  );
  router.post(
    ROUTE.DELETE_FAVOURITE_ACTION,
    asyncCatch(controllers.deleteFavouriteAction),
  );
  router.post(
    ROUTE.GET_FAVOURITE_ACTIONS,
    asyncCatch(controllers.getFavouriteActions),
  );
};
