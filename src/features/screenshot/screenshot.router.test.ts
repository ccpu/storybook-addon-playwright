import { screenshotRouter } from './screenshot.router';
import { createCallerFactory } from '../../trpc/trpc';
import * as service from './screenshot.service';

vi.mock('./screenshot.service');

const createCaller = createCallerFactory(screenshotRouter);
const caller = createCaller({} as any);

describe('screenshotRouter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('takeScreenshot calls makeScreenshot and returns result', async () => {
    const mockResult = { base64: 'abc' };
    (service.makeScreenshot as Mock).mockResolvedValue(mockResult);

    const result = await caller.takeScreenshot({ storyId: 'story--name' });

    expect(service.makeScreenshot).toHaveBeenCalledWith(
      { storyId: 'story--name' },
      true,
    );
    expect(result).toEqual(mockResult);
  });

  it('saveScreenshot calls saveScreenshot service', async () => {
    const mockResult = { pass: true };
    (service.saveScreenshot as Mock).mockResolvedValue(mockResult);

    const result = await caller.saveScreenshot({ storyId: 'story--name' });

    expect(service.saveScreenshot).toHaveBeenCalledWith({
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResult);
  });

  it('deleteScreenshot calls deleteScreenshot service', async () => {
    const mockResult = [{ id: '1' }];
    (service.deleteScreenshot as Mock).mockResolvedValue(mockResult);

    const result = await caller.deleteScreenshot({
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    });

    expect(service.deleteScreenshot).toHaveBeenCalledWith({
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResult);
  });

  it('updateScreenshot calls updateScreenshot service', async () => {
    const mockResult = { pass: true };
    (service.updateScreenshot as Mock).mockResolvedValue(mockResult);

    const result = await caller.updateScreenshot({
      base64: 'abc',
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    });

    expect(service.updateScreenshot).toHaveBeenCalledWith({
      base64: 'abc',
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResult);
  });

  it('testScreenshot calls testScreenshot service', async () => {
    const mockResult = { pass: true };
    (service.testScreenshot as Mock).mockResolvedValue(mockResult);

    const result = await caller.testScreenshot({
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    });

    expect(service.testScreenshot).toHaveBeenCalledWith({
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResult);
  });

  it('getStoryScreenshots calls getStoryScreenshots service', async () => {
    const mockResult = [{ id: '1', title: 'test' }];
    (service.getStoryScreenshots as Mock).mockResolvedValue(mockResult);

    const result = await caller.getStoryScreenshots({
      fileName: 'file.ts',
      storyId: 'story--name',
    });

    expect(service.getStoryScreenshots).toHaveBeenCalledWith({
      fileName: 'file.ts',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResult);
  });

  it('deleteStoryScreenshots calls deleteStoryScreenshots service', async () => {
    (service.deleteStoryScreenshots as Mock).mockResolvedValue(undefined);

    const result = await caller.deleteStoryScreenshots({
      fileName: 'file.ts',
      storyId: 'story--name',
    });

    expect(service.deleteStoryScreenshots).toHaveBeenCalledWith({
      fileName: 'file.ts',
      storyId: 'story--name',
    });
    expect(result).toBeUndefined();
  });

  it('changeScreenshotIndex calls changeScreenshotIndex service', async () => {
    (service.changeScreenshotIndex as Mock).mockResolvedValue(undefined);

    const result = await caller.changeScreenshotIndex({
      fileName: 'file.ts',
      newIndex: 1,
      oldIndex: 0,
      storyId: 'story--name',
    });

    expect(service.changeScreenshotIndex).toHaveBeenCalledWith({
      fileName: 'file.ts',
      newIndex: 1,
      oldIndex: 0,
      storyId: 'story--name',
    });
    expect(result).toBeUndefined();
  });

  it('testStoryScreenshots calls testStoryScreenshots service', async () => {
    const mockResult = [{ pass: true }];
    (service.testStoryScreenshots as Mock).mockResolvedValue(mockResult);

    const result = await caller.testStoryScreenshots({
      fileName: 'file.ts',
      storyId: 'story--name',
    });

    expect(service.testStoryScreenshots).toHaveBeenCalledWith({
      fileName: 'file.ts',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResult);
  });

  it('testScreenshots calls testScreenshots service', async () => {
    const mockResult = [{ pass: true }];
    (service.testScreenshots as Mock).mockResolvedValue(mockResult);

    const result = await caller.testScreenshots({
      requestType: 'all',
    });

    expect(service.testScreenshots).toHaveBeenCalledWith({
      requestType: 'all',
    });
    expect(result).toEqual(mockResult);
  });
});
