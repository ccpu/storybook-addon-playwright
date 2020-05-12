import { responseHandler } from '../response-handler';

describe('responseHandler', () => {
  it('should return object', async () => {
    const res: Partial<Response> = {
      json: () => {
        return new Promise((resolve) => {
          resolve({ test: 'foo' });
        });
      },
      ok: true,
    };
    const result = await responseHandler(res);
    expect(result).toStrictEqual({ test: 'foo' });
  });

  it('should return error message', async () => {
    const res: Partial<Response> = {
      json: () => {
        return new Promise((resolve) => {
          resolve({ message: 'foo' });
        });
      },
      ok: false,
    };

    await expect(responseHandler(res)).rejects.toThrowError('foo');
  });

  it('should not throw if received invalid json', async () => {
    const res: Partial<Response> = {
      json: () => {
        return new Promise(() => {
          throw new Error('Invalid json exemption');
        });
      },
      ok: false,
    };
    const result = await responseHandler(res);
    expect(result).toBe(undefined);
  });
});
