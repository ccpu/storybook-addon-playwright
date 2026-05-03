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
import { server } from '../../msw-server';
import { trpcMswBatch, unwrapBatchInput } from '../../trpc-msw-batch';

describe('screenshot client', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getScreenshot calls screenshot.takeScreenshot mutation', async () => {
    const mockResponse = { base64: 'xyz' };
    const spy = vi.fn().mockReturnValue(mockResponse);
    server.use(
      trpcMswBatch.screenshot.takeScreenshot.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    const result = await getScreenshot({ storyId: 'story--name' } as any);

    expect(spy).toHaveBeenCalledWith({ storyId: 'story--name' });
    expect(result).toEqual(mockResponse);
  });

  it('saveScreenshot calls screenshot.saveScreenshot mutation', async () => {
    const mockResponse = { pass: true };
    const spy = vi.fn().mockReturnValue(mockResponse);
    server.use(
      trpcMswBatch.screenshot.saveScreenshot.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    const result = await saveScreenshot({ storyId: 'story--name' } as any);

    expect(spy).toHaveBeenCalledWith({ storyId: 'story--name' });
    expect(result).toEqual(mockResponse);
  });

  it('deleteScreenshot resolves without error', async () => {
    const spy = vi.fn().mockReturnValue(undefined);
    server.use(
      trpcMswBatch.screenshot.deleteScreenshot.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    await expect(
      deleteScreenshot({ storyId: 'story--name' } as any),
    ).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledWith({ storyId: 'story--name' });
  });

  it('updateScreenshot calls screenshot.updateScreenshot mutation', async () => {
    const mockResponse = { pass: true };
    const spy = vi.fn().mockReturnValue(mockResponse);
    server.use(
      trpcMswBatch.screenshot.updateScreenshot.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    const result = await updateScreenshot({
      base64: 'abc',
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    } as any);

    expect(spy).toHaveBeenCalledWith({
      base64: 'abc',
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResponse);
  });

  it('testScreenshot calls screenshot.testScreenshot mutation', async () => {
    const mockResponse = { pass: true };
    const spy = vi.fn().mockReturnValue(mockResponse);
    server.use(
      trpcMswBatch.screenshot.testScreenshot.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    const result = await testScreenshot({
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    } as any);

    expect(spy).toHaveBeenCalledWith({
      fileName: 'file.ts',
      screenshotId: 'ss-1',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResponse);
  });

  it('getStoryScreenshots calls screenshot.getStoryScreenshots mutation', async () => {
    const mockResponse = [{ id: '1', title: 'test' }];
    const spy = vi.fn().mockReturnValue(mockResponse);
    server.use(
      trpcMswBatch.screenshot.getStoryScreenshots.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    const result = await getStoryScreenshots({
      fileName: 'file.ts',
      storyId: 'story--name',
    } as any);

    expect(spy).toHaveBeenCalledWith({
      fileName: 'file.ts',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResponse);
  });

  it('deleteStoryScreenshots resolves without error', async () => {
    const spy = vi.fn().mockReturnValue(undefined);
    server.use(
      trpcMswBatch.screenshot.deleteStoryScreenshots.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    await expect(
      deleteStoryScreenshots({
        fileName: 'file.ts',
        storyId: 'story--name',
      } as any),
    ).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledWith({
      fileName: 'file.ts',
      storyId: 'story--name',
    });
  });

  it('changeScreenShotIndex calls screenshot.changeScreenshotIndex mutation', async () => {
    const spy = vi.fn().mockReturnValue(undefined);
    server.use(
      trpcMswBatch.screenshot.changeScreenshotIndex.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    await expect(
      changeScreenShotIndex({
        fileName: 'file.ts',
        newIndex: 1,
        oldIndex: 0,
        storyId: 'story--name',
      } as any),
    ).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledWith({
      fileName: 'file.ts',
      newIndex: 1,
      oldIndex: 0,
      storyId: 'story--name',
    });
  });

  it('testStoryScreenshots calls screenshot.testStoryScreenshots mutation', async () => {
    const mockResponse = [{ pass: true }];
    const spy = vi.fn().mockReturnValue(mockResponse);
    server.use(
      trpcMswBatch.screenshot.testStoryScreenshots.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    const result = await testStoryScreenshots({
      fileName: 'file.ts',
      storyId: 'story--name',
    } as any);

    expect(spy).toHaveBeenCalledWith({
      fileName: 'file.ts',
      storyId: 'story--name',
    });
    expect(result).toEqual(mockResponse);
  });

  it('testScreenshots calls screenshot.testScreenshots mutation', async () => {
    const mockResponse = [{ pass: true }];
    const spy = vi.fn().mockReturnValue(mockResponse);
    server.use(
      trpcMswBatch.screenshot.testScreenshots.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    const result = await testScreenshots({ requestType: 'all' } as any);

    expect(spy).toHaveBeenCalledWith({
      requestType: 'all',
    });
    expect(result).toEqual(mockResponse);
  });
});
