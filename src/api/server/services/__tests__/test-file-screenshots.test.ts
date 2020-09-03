jest.mock('fast-glob', () => ({
  __esModule: true as never,
  default: () => {
    return new Promise((resolve) => {
      resolve(['story.ts']);
    });
  },
}));

import { testFileScreenshots } from '../test-file-screenshots';
import { testStoryScreenshots } from '../test-story-screenshots';
import { mocked } from 'ts-jest/utils';
import { defaultConfigs } from '../../../../../__test_data__/configs';
import { getConfigs } from '../../configs';

jest.mock('../../configs');
jest.mock('../make-screenshot');
jest.mock('../../utils/load-story-data');
jest.mock('../diff-image-to-screenshot');
jest.mock('../test-story-screenshots.ts');

const beforeFileImageDiffMock = jest.fn();
const afterFileImageDiffMock = jest.fn();
mocked(getConfigs).mockImplementation(() => ({
  afterFileImageDiff: afterFileImageDiffMock,
  beforeFileImageDiff: beforeFileImageDiffMock,
  ...defaultConfigs(),
}));

mocked(testStoryScreenshots).mockImplementation(() => {
  return new Promise((resolve) => {
    resolve([
      {
        added: true,
        newScreenshot: 'base64-image',
        screenshotId: 'screenshot-id',
        storyId: 'story-id',
      },
    ]);
  });
});

describe('testFileScreenshots', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should have appropriate data', async () => {
    await testFileScreenshots({
      fileName: 'story.ts',
      onComplete: jest.fn(),
      requestId: 'request-id',
      requestType: 'all',
    });

    expect(testStoryScreenshots).toHaveBeenCalledWith({
      fileName: 'story.ts',
      requestId: 'request-id',
      requestType: 'all',
      storyId: 'story-id',
    });
  });

  it('should call callbacks', async () => {
    await testFileScreenshots({
      fileName: 'story.ts',
      requestId: 'request-id',
      requestType: 'all',
    });

    expect(beforeFileImageDiffMock).toHaveBeenCalledWith({
      fileName: 'story.ts',
      requestId: 'request-id',
      requestType: 'all',
    });
    expect(afterFileImageDiffMock).toHaveBeenCalledWith(
      [
        {
          added: true,
          newScreenshot: 'base64-image',
          screenshotId: 'screenshot-id',
          storyId: 'story-id',
        },
      ],
      { fileName: 'story.ts', requestId: 'request-id', requestType: 'all' },
    );
  });

  it('should have result', async () => {
    const onCompleteMock = jest.fn();
    const result = await testFileScreenshots({
      fileName: 'story.ts',
      onComplete: onCompleteMock,
      requestId: 'request-id',
    });

    const data = [
      {
        added: true,
        newScreenshot: 'base64-image',
        screenshotId: 'screenshot-id',
        storyId: 'story-id',
      },
    ];

    expect(result).toStrictEqual(data);

    expect(onCompleteMock).toHaveBeenCalledWith(data);
  });

  it('should test story within file', async () => {
    const onCompleteMock = jest.fn();
    const result = await testFileScreenshots({
      fileName: 'story.ts',
      onComplete: onCompleteMock,
      requestId: 'request-id',
      storyId: 'story-id',
    });

    const data = [
      {
        added: true,
        newScreenshot: 'base64-image',
        screenshotId: 'screenshot-id',
        storyId: 'story-id',
      },
    ];

    expect(result).toStrictEqual(data);

    expect(onCompleteMock).toHaveBeenCalledWith(data);

    expect(testStoryScreenshots).toHaveBeenCalledWith({
      fileName: 'story.ts',
      requestId: 'request-id',
      requestType: 'story',
      storyId: 'story-id',
    });
  });

  it('should not test if not found story within file', async () => {
    const onCompleteMock = jest.fn();
    const result = await testFileScreenshots({
      fileName: 'story.ts',
      onComplete: onCompleteMock,
      requestId: 'request-id',
      requestType: 'story',
      storyId: 'story-id-2',
    });

    expect(result).toStrictEqual([]);

    expect(onCompleteMock).toHaveBeenCalledWith([]);

    expect(testStoryScreenshots).toHaveBeenCalledTimes(0);
  });
});
