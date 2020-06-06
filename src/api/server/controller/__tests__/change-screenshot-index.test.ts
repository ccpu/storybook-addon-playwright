import { changeScreenShotIndex } from '../change-screenshot-index';
import { changeScreenshotIndex as changeScreenshotIndexService } from '../../services/change-screenshot-index';
import { Response, Request } from 'express';

jest.mock('../../services/change-screenshot-index.ts');

describe('changeScreenShotIndex', () => {
  it('should send 200', async () => {
    const statusMock = jest.fn();
    const endMock = jest.fn();
    await changeScreenShotIndex(
      {} as Request,
      ({ end: endMock, status: statusMock } as unknown) as Response,
    );
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(endMock).toHaveBeenCalledTimes(1);
    expect(changeScreenshotIndexService).toHaveBeenCalledTimes(1);
  });
});
