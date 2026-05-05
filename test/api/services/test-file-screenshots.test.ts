vi.mock('fast-glob', () => ({
  __esModule: true as never,
  default: () => {
    return new Promise((resolve) => {
      resolve(['story.ts']);
    });
  },
}));

import { testFileScreenshots } from '../../../src/api/services/test-file-screenshots';
import { testStoryScreenshots } from '../../../src/api/services/test-story-screenshots';
import { defaultConfigs } from '../../configs/configs';
import { getConfigs } from '../../../src/api/server/configs';

vi.mock(
  '../../../src/api/server/configs',
  async () => await import('../server/__mocks__/configs'),
);
vi.mock(
  '../../../src/api/services/make-screenshot',
  async () => await import('./__mocks__/make-screenshot'),
);
vi.mock(
  '../../../src/api/server/utils/load-story-data',
  async () => await import('../server/utils/__mocks__/load-story-data'),
);
vi.mock(
  '../../../src/api/services/diff-image-to-screenshot',
  async () => await import('./__mocks__/diff-image-to-screenshot'),
);
vi.mock(
  '../../../src/api/services/test-story-screenshots',
  async () => await import('./__mocks__/test-story-screenshots'),
);

const beforeFileImageDiffMock = vi.fn();
const afterFileImageDiffMock = vi.fn();
vi.mocked(getConfigs).mockImplementation(() => ({
  afterFileImageDiff: afterFileImageDiffMock,
  beforeFileImageDiff: beforeFileImageDiffMock,
  ...defaultConfigs(),
}));

vi.mocked(testStoryScreenshots).mockImplementation(() => {
  return new Promise((resolve) => {
    resolve([
      {
        added: true,
        newScreenshot: 'base64-image',
        pass: false,
        screenshotId: 'screenshot-id',
        storyId: 'story-id',
      },
    ]);
  });
});

describe('testFileScreenshots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should have appropriate data', async () => {
    await testFileScreenshots({
      filePath: 'story.ts',
      onComplete: vi.fn(),
      requestId: 'request-id',
      requestType: 'all',
    });

    expect(testStoryScreenshots).toHaveBeenCalledWith({
      filePath: 'story.ts',
      requestId: 'request-id',
      requestType: 'all',
      storyId: 'story-id',
    });
  });

  it('should call callbacks', async () => {
    await testFileScreenshots({
      filePath: 'story.ts',
      requestId: 'request-id',
      requestType: 'all',
    });

    expect(beforeFileImageDiffMock).toHaveBeenCalledWith({
      filePath: 'story.ts',
      requestId: 'request-id',
      requestType: 'all',
      storyId: 'story-id',
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
      {
        filePath: 'story.ts',
        requestId: 'request-id',
        requestType: 'all',
        storyId: 'story-id',
      },
    );
  });

  it('should have result', async () => {
    const onCompleteMock = vi.fn();
    const result = await testFileScreenshots({
      filePath: 'story.ts',
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
    const onCompleteMock = vi.fn();
    const result = await testFileScreenshots({
      filePath: 'story.ts',
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
      filePath: 'story.ts',
      requestId: 'request-id',
      requestType: 'story',
      storyId: 'story-id',
    });
  });

  it('should not test if not found story within file', async () => {
    const onCompleteMock = vi.fn();
    const result = await testFileScreenshots({
      filePath: 'story.ts',
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
