import { testStoryScreenshots } from '../../../src/api/services/test-story-screenshots';
import { getConfigs } from '../../../src/api/server/configs';
import { defaultConfigs } from '../../configs/configs';

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
  '../../../src/api/server/configs',
  async () => await import('../server/__mocks__/configs'),
);

const afterStoryImageDiffMock = vi.fn();
const beforeStoryImageDiffMock = vi.fn();
vi.mocked(getConfigs).mockImplementation(() => ({
  afterStoryImageDiff: afterStoryImageDiffMock,
  beforeStoryImageDiff: beforeStoryImageDiffMock,
  ...defaultConfigs(),
}));

describe('testStoryScreenshot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have diff', async () => {
    const result = await testStoryScreenshots({
      filePath: 'story.ts',
      requestId: 'request-id',
      storyId: 'story-id',
    });
    expect(result).toStrictEqual([
      {
        added: true,
        filePath: 'story.ts',
        newScreenshot: 'base64-image',
        screenshotData: {
          actionSets: [
            {
              actions: [{ args: { selector: 'html' }, id: 'action-id', name: 'click' }],
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
      },
      {
        added: true,
        filePath: 'story.ts',
        newScreenshot: 'base64-image',
        screenshotData: {
          actionSets: [
            {
              actions: [{ args: { selector: 'html' }, id: 'action-id', name: 'click' }],
              id: 'action-set-id-2',
              title: 'click',
            },
          ],
          browserType: 'chromium',
          id: 'screenshot-id-2',
          index: 1,
          title: 'title-2',
        },
        screenshotId: 'screenshot-id-2',
        storyId: 'story-id',
      },
    ]);
  });

  it('should throw if story not found', async () => {
    await expect(
      testStoryScreenshots({
        filePath: 'story.ts',
        requestId: 'request-id',
        storyId: 'story-id-2',
      }),
    ).rejects.toThrowError('Unable to find story screenshots');
  });

  it('should call afterAllImageDiff with result', async () => {
    await testStoryScreenshots({
      filePath: 'story.ts',
      requestId: 'request-id',
      requestType: 'story',
      storyId: 'story-id',
    });
    expect(afterStoryImageDiffMock).toHaveBeenCalledWith(
      [
        {
          added: true,
          filePath: 'story.ts',
          newScreenshot: 'base64-image',
          screenshotData: {
            actionSets: [
              {
                actions: [
                  {
                    args: { selector: 'html' },
                    id: 'action-id',
                    name: 'click',
                  },
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
        },
        {
          added: true,
          filePath: 'story.ts',
          newScreenshot: 'base64-image',
          screenshotData: {
            actionSets: [
              {
                actions: [
                  {
                    args: { selector: 'html' },
                    id: 'action-id',
                    name: 'click',
                  },
                ],
                id: 'action-set-id-2',
                title: 'click',
              },
            ],
            browserType: 'chromium',
            id: 'screenshot-id-2',
            index: 1,
            title: 'title-2',
          },
          screenshotId: 'screenshot-id-2',
          storyId: 'story-id',
        },
      ],
      {
        filePath: 'story.ts',
        requestId: 'request-id',
        requestType: 'story',
        storyId: 'story-id',
      },
    );
  });

  it('should call beforeStoryImageDiff with request data', async () => {
    await testStoryScreenshots({
      filePath: 'story.ts',
      requestId: 'request-id',
      storyId: 'story-id',
    });
    expect(beforeStoryImageDiffMock).toHaveBeenCalledWith({
      filePath: 'story.ts',
      requestId: 'request-id',
      requestType: 'story',
      storyId: 'story-id',
    });
  });
});
