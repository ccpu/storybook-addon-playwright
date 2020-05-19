import expressMiddleWare, { asyncCatch } from '../routes';
import { Response, Request } from 'express';

describe('expressMiddleWare', () => {
  it('should register post', () => {
    const postMock = jest.fn();
    expressMiddleWare({ post: postMock, use: jest.fn() });
    expect(postMock).toHaveBeenCalled();
  });

  it('should execute async', () => {
    const mockFunc = jest.fn();
    asyncCatch(mockFunc)({} as Request, {} as Response, () => {
      return;
    });
    expect(mockFunc).toHaveBeenCalled();
  });

  it('should catch error and passed it to next', () => {
    const mockNext = jest.fn();
    asyncCatch(() => {
      throw new Error('foo');
    })({} as Request, {} as Response, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
});
