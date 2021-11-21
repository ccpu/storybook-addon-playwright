import { testScreenshotService } from '../test-screenshot-service';
import { diffImageToScreenshot } from '../diff-image-to-screenshot';
import { mocked } from 'ts-jest/utils';
import { getConfigs } from '../../configs';
import { defaultConfigs } from '../../../../../__test_data__/configs';
import fs from 'fs';

jest.mock('../../configs');
jest.mock('../make-screenshot');
jest.mock('../diff-image-to-screenshot');
jest.mock('../../utils/load-story-data');
jest.mock('fs');

describe('testScreenshot', () => {
  mocked(getConfigs).mockImplementation(() => ({
    ...defaultConfigs(),
  }));
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should have result', async () => {
    const result = await testScreenshotService({
      fileName: 'story.ts',
      requestId: 'request-id',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
    expect(result).toStrictEqual({
      added: true,
      fileName: 'story.ts',
      newScreenshot: 'base64-image',
      screenshotData: {
        actionSets: [
          {
            actions: [
              { args: { selector: 'html' }, id: 'action-id', name: 'click' },
            ],
            id: 'action-set-id',
            title: 'click',
          },
        ],
        browserType: 'chromium',
        id: 'screenshot-id',
        index: 0,
        title: 'title',
      },
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
  });

  it('should throw if screenshot not found', async () => {
    await expect(
      testScreenshotService({
        fileName: 'story.ts',
        requestId: 'request-id',
        screenshotId: 'screenshot-id',
        storyId: 'story-id-2',
      }),
    ).rejects.toThrowError('Unable to find screenshot data.');
  });

  it('should handle exceptions', async () => {
    mocked(diffImageToScreenshot).mockImplementationOnce(() => {
      throw new Error('ops');
    });
    const result = await testScreenshotService({
      fileName: 'story.ts',
      requestId: 'request-id',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
    expect(result).toStrictEqual({
      error: 'ops',
      fileName: 'story.ts',
      pass: false,
      screenshotData: {
        actionSets: [
          {
            actions: [
              { args: { selector: 'html' }, id: 'action-id', name: 'click' },
            ],
            id: 'action-set-id',
            title: 'click',
          },
        ],
        browserType: 'chromium',
        id: 'screenshot-id',
        index: 0,
        title: 'title',
      },
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
  });
});

describe('testScreenshot compareScreenshot', () => {
  const compareScreenshotMock = jest.fn();
  const existsSyncMock = jest.spyOn(fs, 'existsSync');
  existsSyncMock.mockReturnValue(true);

  beforeEach(() => {
    jest.clearAllMocks();
    mocked(getConfigs).mockImplementationOnce(() => ({
      ...defaultConfigs(),
      compareScreenshot: compareScreenshotMock,
    }));
  });

  it('should throw error if unable to find base image file', async () => {
    existsSyncMock.mockReturnValueOnce(false);

    const result = await testScreenshotService({
      fileName: 'story.ts',
      requestId: 'request-id',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });

    expect(result.error.startsWith('Unable to find the file for ')).toBe(true);
  });

  it('should use diffImageToScreenshot if compareScreenshot return false', async () => {
    mocked(compareScreenshotMock).mockReturnValueOnce(false);

    await testScreenshotService({
      fileName: 'story.ts',
      requestId: 'request-id',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });

    expect(diffImageToScreenshot).toHaveBeenCalledTimes(1);
  });

  it('should handle returned result from compareScreenshot', async () => {
    mocked(compareScreenshotMock).mockReturnValueOnce(
      new Promise((resolve) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resolve({
          imgSrcString: 'imgSrcBase64',
          newScreenshot: undefined,
          pass: true,
        });
      }),
    );

    const result = await testScreenshotService({
      fileName: 'story.ts',
      requestId: 'request-id',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });

    expect(result).toStrictEqual({
      fileName: 'story.ts',
      imgSrcString: 'imgSrcBase64',
      newScreenshot: 'base64-image',
      pass: true,
      screenshotData: {
        actionSets: [
          {
            actions: [
              { args: { selector: 'html' }, id: 'action-id', name: 'click' },
            ],
            id: 'action-set-id',
            title: 'click',
          },
        ],
        browserType: 'chromium',
        id: 'screenshot-id',
        index: 0,
        title: 'title',
      },
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
  });
});
