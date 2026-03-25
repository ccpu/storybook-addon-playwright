const routes = require('./dist/api/server/routes');
const { ROUTE } = require('./dist/constants/routes');

const addonRoutes = Object.values(ROUTE);

function registerAddonMiddleware(router, middleware) {
  addonRoutes.forEach((route) => {
    router.use(route, middleware);
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

module.exports = function (router) {
  registerAddonMiddleware(router, addExpressCompat);
  const expressMiddleWare = routes.default || routes;
  expressMiddleWare(router);
};
