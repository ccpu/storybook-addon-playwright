import expressMiddleWare, { asyncCatch } from '../routes';
import { Response, Request } from 'express';
import { ROUTE } from '../../../constants/routes';

describe('expressMiddleWare', () => {
  it('should register post', () => {
    const postMock = jest.fn();
    expressMiddleWare({ post: postMock, use: jest.fn() });
    expect(postMock).toHaveBeenCalled();
  });

  it('should scope middleware to addon routes only', () => {
    const useMock = jest.fn();

    expressMiddleWare({ post: jest.fn(), use: useMock });

    expect(useMock.mock.calls).toHaveLength(Object.values(ROUTE).length * 3);
    expect(
      useMock.mock.calls.every(
        ([path, middleware]) =>
          typeof path === 'string' &&
          Object.values(ROUTE).includes(path) &&
          typeof middleware === 'function',
      ),
    ).toBe(true);
  });

  it('should execute async', () => {
    const mockFunc = jest.fn();
    asyncCatch(mockFunc)(
      {} as Request,
      {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response,
    );
    expect(mockFunc).toHaveBeenCalled();
  });

  it('should catch error and send 500 response', async () => {
    const mockSend = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ send: mockSend });
    await asyncCatch(() => {
      throw new Error('foo');
    })({} as Request, { status: mockStatus } as unknown as Response);
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockSend).toHaveBeenCalled();
  });
});
