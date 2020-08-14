jest.mock('fast-glob', () => ({
  __esModule: true as never,
  default: () => {
    return new Promise((resolve) => {
      resolve(['story.ts']);
    });
  },
}));

import { testScreenshots } from '../test-file-screenshots';
import { testStoryScreenshots } from '../test-story-screenshots';
import { mocked } from 'ts-jest/utils';

jest.mock('../../configs');
jest.mock('../make-screenshot');
jest.mock('../../utils/load-story-data');
jest.mock('../diff-image-to-screenshot');
jest.mock('../test-story-screenshots.ts');

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

describe('testScreenshots', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should have appropriate data', async () => {
    await testScreenshots({
      fileName: 'story.ts',
      onComplete: jest.fn(),
      requestId: 'request-id',
      requestType: 'app',
    });

    expect(testStoryScreenshots).toHaveBeenCalledWith({
      fileName: 'story.ts',
      requestId: 'request-id__0',
      requestType: 'app',
      storyId: 'story-id',
    });
  });

  it('should have result', async () => {
    const onCompleteMock = jest.fn();
    const result = await testScreenshots({
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
});
