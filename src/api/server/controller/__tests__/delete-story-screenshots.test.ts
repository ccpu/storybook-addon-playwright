import { deleteStoryScreenshot } from '../delete-story-screenshots';
import { deleteStoryScreenshots as deleteStoryScreenshotsService } from '../../services/delete-story-screenshots';

jest.mock('../../services/delete-story-screenshots.ts');

describe('deleteStoryScreenshot', () => {
  it('should send 200', async () => {
    const statusMock = jest.fn();
    const endMock = jest.fn();
    await deleteStoryScreenshot(
      {} as Request,
      ({ end: endMock, status: statusMock } as unknown) as Response,
    );
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(endMock).toHaveBeenCalledTimes(1);
    expect(deleteStoryScreenshotsService).toHaveBeenCalledTimes(1);
  });
});
