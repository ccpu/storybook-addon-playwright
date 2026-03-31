vi.mock('fast-glob', () => ({
  __esModule: true as never,
  default: () => {
    return new Promise((resolve) => {
      resolve(['story.ts']);
    });
  },
}));

import { testFileScreenshots } from '../test-file-screenshots';
import { testStoryScreenshots } from '../test-story-screenshots';
import { defaultConfigs } from '../../../../../__test_data__/configs';
import { getConfigs } from '../../configs';

vi.mock('../../configs');
vi.mock('../make-screenshot');
vi.mock('../../utils/load-story-data');
vi.mock('../diff-image-to-screenshot');
vi.mock('../test-story-screenshots.ts');

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
      fileName: 'story.ts',
      onComplete: vi.fn(),
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
        fileName: 'story.ts',
        requestId: 'request-id',
        requestType: 'all',
        storyId: 'story-id',
      },
    );
  });

  it('should have result', async () => {
    const onCompleteMock = vi.fn();
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
    const onCompleteMock = vi.fn();
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
    const onCompleteMock = vi.fn();
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
