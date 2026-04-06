vi.mock(
  '../../../src/api/trpc/client',
  async () => await import('../../api/trpc/__mocks__/client'),
);

import { trpc } from '../../../src/api/trpc/client';
import {
  getScreenshot,
  saveScreenshot,
  deleteScreenshot,
  updateScreenshot,
  testScreenshot,
  getStoryScreenshots,
  deleteStoryScreenshots,
  changeScreenShotIndex,
  testStoryScreenshots,
  testScreenshots,
} from '../../../src/api/trpc/clients/screenshot.client';

describe('screenshot client', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getScreenshot calls trpc.screenshot.takeScreenshot.mutate', async () => {
    const mockResponse = { base64: 'xyz' };
    (trpc.screenshot.takeScreenshot.mutate as Mock).mockResolvedValueOnce(
      mockResponse,
    );

    const result = await getScreenshot({ storyId: 'story--name' } as any);

    expect(trpc.screenshot.takeScreenshot.mutate).toHaveBeenCalledWith({
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResponse);
  });

  it('saveScreenshot calls trpc.screenshot.saveScreenshot.mutate', async () => {
    const mockResponse = { pass: true };
    (trpc.screenshot.saveScreenshot.mutate as Mock).mockResolvedValueOnce(
      mockResponse,
    );

    const result = await saveScreenshot({ storyId: 'story--name' } as any);

    expect(trpc.screenshot.saveScreenshot.mutate).toHaveBeenCalledWith({
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResponse);
  });

  it('deleteScreenshot resolves without error', async () => {
    (trpc.screenshot.deleteScreenshot.mutate as Mock).mockResolvedValueOnce(
      undefined,
    );

    await expect(
      deleteScreenshot({ storyId: 'story--name' } as any),
    ).resolves.toBeUndefined();
  });

  it('updateScreenshot calls trpc.screenshot.updateScreenshot.mutate', async () => {
    const mockResponse = { pass: true };
    (trpc.screenshot.updateScreenshot.mutate as Mock).mockResolvedValueOnce(
      mockResponse,
    );

    const result = await updateScreenshot({
      base64: 'abc',
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    } as any);

    expect(trpc.screenshot.updateScreenshot.mutate).toHaveBeenCalledWith({
      base64: 'abc',
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResponse);
  });

  it('testScreenshot calls trpc.screenshot.testScreenshot.mutate', async () => {
    const mockResponse = { pass: true };
    (trpc.screenshot.testScreenshot.mutate as Mock).mockResolvedValueOnce(
      mockResponse,
    );

    const result = await testScreenshot({
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    } as any);

    expect(trpc.screenshot.testScreenshot.mutate).toHaveBeenCalledWith({
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResponse);
  });

  it('getStoryScreenshots calls trpc.screenshot.getStoryScreenshots.mutate', async () => {
    const mockResponse = [{ id: '1', title: 'test' }];
    (trpc.screenshot.getStoryScreenshots.mutate as Mock).mockResolvedValueOnce(
      mockResponse,
    );

    const result = await getStoryScreenshots({
      fileName: 'file.ts',
      storyId: 'story--name',
    } as any);

    expect(trpc.screenshot.getStoryScreenshots.mutate).toHaveBeenCalledWith({
      fileName: 'file.ts',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResponse);
  });

  it('deleteStoryScreenshots resolves without error', async () => {
    (
      trpc.screenshot.deleteStoryScreenshots.mutate as Mock
    ).mockResolvedValueOnce(undefined);

    await expect(
      deleteStoryScreenshots({
        fileName: 'file.ts',
        storyId: 'story--name',
      } as any),
    ).resolves.toBeUndefined();
  });

  it('changeScreenShotIndex calls trpc.screenshot.changeScreenshotIndex.mutate', async () => {
    (
      trpc.screenshot.changeScreenshotIndex.mutate as Mock
    ).mockResolvedValueOnce(undefined);

    await expect(
      changeScreenShotIndex({
        fileName: 'file.ts',
        newIndex: 1,
        oldIndex: 0,
        storyId: 'story--name',
      } as any),
    ).resolves.toBeUndefined();
  });

  it('testStoryScreenshots calls trpc.screenshot.testStoryScreenshots.mutate', async () => {
    const mockResponse = [{ pass: true }];
    (trpc.screenshot.testStoryScreenshots.mutate as Mock).mockResolvedValueOnce(
      mockResponse,
    );

    const result = await testStoryScreenshots({
      fileName: 'file.ts',
      storyId: 'story--name',
    } as any);

    expect(trpc.screenshot.testStoryScreenshots.mutate).toHaveBeenCalledWith({
      fileName: 'file.ts',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResponse);
  });

  it('testScreenshots calls trpc.screenshot.testScreenshots.mutate', async () => {
    const mockResponse = [{ pass: true }];
    (trpc.screenshot.testScreenshots.mutate as Mock).mockResolvedValueOnce(
      mockResponse,
    );

    const result = await testScreenshots({ requestType: 'all' } as any);

    expect(trpc.screenshot.testScreenshots.mutate).toHaveBeenCalledWith({
      requestType: 'all',
    });
    expect(result).toEqual(mockResponse);
  });
});
