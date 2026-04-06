import { screenshotRouter } from '../../../src/api/trpc/routers/screenshot.router';
import { createCallerFactory } from '../../../src/api/trpc/trpc';
import { makeScreenshot } from '../../../src/api/services/make-screenshot';
import { saveScreenshot } from '../../../src/api/services/save-screenshot';
import { deleteScreenshot } from '../../../src/api/services/delete-screenshot';
import { updateScreenshotService } from '../../../src/api/services/update-screenshot-service';
import { testScreenshotService } from '../../../src/api/services/test-screenshot-service';
import { getStoryScreenshotsData } from '../../../src/api/services/get-story-screenshots-data';
import { deleteStoryScreenshots } from '../../../src/api/services/delete-story-screenshots';
import { changeScreenshotIndex } from '../../../src/api/services/change-screenshot-index';
import { testStoryScreenshots } from '../../../src/api/services/test-story-screenshots';
import { testScreenshots } from '../../../src/api/services/test-screenshots-service';

vi.mock('../../../src/api/services/make-screenshot');
vi.mock('../../../src/api/services/save-screenshot');
vi.mock('../../../src/api/services/delete-screenshot');
vi.mock('../../../src/api/services/update-screenshot-service');
vi.mock('../../../src/api/services/test-screenshot-service');
vi.mock('../../../src/api/services/get-story-screenshots-data');
vi.mock('../../../src/api/services/delete-story-screenshots');
vi.mock('../../../src/api/services/change-screenshot-index');
vi.mock('../../../src/api/services/test-story-screenshots');
vi.mock('../../../src/api/services/test-screenshots-service');

const createCaller = createCallerFactory(screenshotRouter);
const caller = createCaller({} as any);

describe('screenshotRouter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('takeScreenshot calls makeScreenshot and returns result', async () => {
    const mockResult = { base64: 'abc' };
    (makeScreenshot as Mock).mockResolvedValue(mockResult);

    const result = await caller.takeScreenshot({ storyId: 'story--name' });

    expect(makeScreenshot).toHaveBeenCalledWith(
      { storyId: 'story--name' },
      true,
    );
    expect(result).toEqual(mockResult);
  });

  it('saveScreenshot calls saveScreenshot service', async () => {
    const mockResult = { pass: true };
    (saveScreenshot as Mock).mockResolvedValue(mockResult);

    const result = await caller.saveScreenshot({ storyId: 'story--name' });

    expect(saveScreenshot).toHaveBeenCalledWith({
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResult);
  });

  it('deleteScreenshot calls deleteScreenshot service', async () => {
    const mockResult = [{ id: '1' }];
    (deleteScreenshot as Mock).mockResolvedValue(mockResult);

    const result = await caller.deleteScreenshot({
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    });

    expect(deleteScreenshot).toHaveBeenCalledWith({
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResult);
  });

  it('updateScreenshot calls updateScreenshotService service', async () => {
    const mockResult = { pass: true };
    (updateScreenshotService as Mock).mockResolvedValue(mockResult);

    const result = await caller.updateScreenshot({
      base64: 'abc',
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    });

    expect(updateScreenshotService).toHaveBeenCalledWith({
      base64: 'abc',
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResult);
  });

  it('testScreenshot calls testScreenshotService service', async () => {
    const mockResult = { pass: true };
    (testScreenshotService as Mock).mockResolvedValue(mockResult);

    const result = await caller.testScreenshot({
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    });

    expect(testScreenshotService).toHaveBeenCalledWith({
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResult);
  });

  it('getStoryScreenshots calls getStoryScreenshotsData service', async () => {
    const mockResult = [{ id: '1', title: 'test' }];
    (getStoryScreenshotsData as Mock).mockResolvedValue(mockResult);

    const result = await caller.getStoryScreenshots({
      fileName: 'file.ts',
      storyId: 'story--name',
    });

    expect(getStoryScreenshotsData).toHaveBeenCalledWith({
      fileName: 'file.ts',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResult);
  });

  it('deleteStoryScreenshots calls deleteStoryScreenshots service', async () => {
    (deleteStoryScreenshots as Mock).mockResolvedValue(undefined);

    const result = await caller.deleteStoryScreenshots({
      fileName: 'file.ts',
      storyId: 'story--name',
    });

    expect(deleteStoryScreenshots).toHaveBeenCalledWith({
      fileName: 'file.ts',
      storyId: 'story--name',
    });
    expect(result).toBeUndefined();
  });

  it('changeScreenshotIndex calls changeScreenshotIndex service', async () => {
    (changeScreenshotIndex as Mock).mockResolvedValue(undefined);

    const result = await caller.changeScreenshotIndex({
      fileName: 'file.ts',
      newIndex: 1,
      oldIndex: 0,
      storyId: 'story--name',
    });

    expect(changeScreenshotIndex).toHaveBeenCalledWith({
      fileName: 'file.ts',
      newIndex: 1,
      oldIndex: 0,
      storyId: 'story--name',
    });
    expect(result).toBeUndefined();
  });

  it('testStoryScreenshots calls testStoryScreenshots service', async () => {
    const mockResult = [{ pass: true }];
    (testStoryScreenshots as Mock).mockResolvedValue(mockResult);

    const result = await caller.testStoryScreenshots({
      fileName: 'file.ts',
      storyId: 'story--name',
    });

    expect(testStoryScreenshots).toHaveBeenCalledWith({
      fileName: 'file.ts',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResult);
  });

  it('testScreenshots calls testScreenshots service', async () => {
    const mockResult = [{ pass: true }];
    (testScreenshots as Mock).mockResolvedValue(mockResult);

    const result = await caller.testScreenshots({
      requestType: 'all',
    });

    expect(testScreenshots).toHaveBeenCalledWith({
      requestType: 'all',
    });
    expect(result).toEqual(mockResult);
  });
});
