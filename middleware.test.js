jest.mock('./dist/constants/routes', () => ({
  ROUTE: {
    GET_SCHEMA: '/getSchema',
    TAKE_SCREENSHOT: '/screenshot/get',
  },
}));

jest.mock('./dist/api/server/routes', () => jest.fn());

const middleware = require('./middleware');
const routes = require('./dist/api/server/routes');

describe('middleware', () => {
  it('should register compat middleware only for addon routes', () => {
    const router = { use: jest.fn() };

    middleware(router);

    expect(router.use).toHaveBeenNthCalledWith(
      1,
      '/getSchema',
      expect.any(Function),
    );
    expect(router.use).toHaveBeenNthCalledWith(
      2,
      '/screenshot/get',
      expect.any(Function),
    );
    expect(routes).toHaveBeenCalledWith(router);
  });

  it('should send buffers without serializing them to json', () => {
    const router = { use: jest.fn() };

    middleware(router);

    const compatMiddleware = router.use.mock.calls[0][1];
    const res = {
      end: jest.fn(),
      setHeader: jest.fn(),
    };
    const payload = Buffer.from('<!doctype html>');

    compatMiddleware({}, res, jest.fn());
    res.send(payload);

    expect(res.end).toHaveBeenCalledWith(payload);
    expect(res.setHeader).not.toHaveBeenCalled();
  });
});
