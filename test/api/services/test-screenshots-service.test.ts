import { defaultConfigs } from '../../configs/configs';
import { testScreenshots } from '../../../src/api/services/test-screenshots-service';
import { getConfigs } from '../../../src/api/server/configs';
import { testFileScreenshots } from '../../../src/api/services/test-file-screenshots';

vi.mock(
  '../../../src/api/services/make-screenshot',
  async () => await import('./__mocks__/make-screenshot'),
);
vi.mock(
  '../../../src/api/server/utils/load-story-data',
  async () => await import('../server/utils/__mocks__/load-story-data'),
);
vi.mock(
  '../../../src/api/server/configs',
  async () => await import('../server/__mocks__/configs'),
);
vi.mock('../../../src/api/services/test-file-screenshots');
vi.mock(
  '../../../src/utils/get-playwright-config-files',
  async () => await import('../../utils/__mocks__/get-playwright-config-files'),
);

const afterAllImageDiffMock = vi.fn();
const beforeAllImageDiffMock = vi.fn();

vi.mocked(getConfigs).mockImplementation(() => ({
  afterAllImageDiff: afterAllImageDiffMock,
  beforeAllImageDiff: beforeAllImageDiffMock,
  ...defaultConfigs(),
}));

vi.mocked(testFileScreenshots).mockImplementation(() => {
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

describe('testAppScreenshot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have result', async () => {
    const result = await testScreenshots({
      requestId: 'request-id',
      requestType: 'all',
      storyId: 'story-id',
    });

    expect(testFileScreenshots).toHaveBeenCalledWith({
      disableEvans: true,
      fileName: './stories/test.stories.playwright.json',
      requestId: 'request-id',
      requestType: 'all',
      storyId: 'story-id',
    });

    expect(testFileScreenshots).toHaveBeenCalledWith({
      disableEvans: true,
      fileName: './stories/test-2.stories.playwright.json',
      requestId: 'request-id',
      requestType: 'all',
      storyId: 'story-id',
    });

    expect(result).toStrictEqual([
      {
        added: true,
        newScreenshot: 'base64-image',
        screenshotId: 'screenshot-id',
        storyId: 'story-id',
      },
      {
        added: true,
        newScreenshot: 'base64-image',
        screenshotId: 'screenshot-id',
        storyId: 'story-id',
      },
    ]);
  });

  it('should call afterAllImageDiffMock with result', async () => {
    await testScreenshots({
      requestId: 'request-id',
      requestType: 'all',
      storyId: 'story-id',
    });

    expect(afterAllImageDiffMock).toHaveBeenCalledWith(
      [
        {
          added: true,
          newScreenshot: 'base64-image',
          screenshotId: 'screenshot-id',
          storyId: 'story-id',
        },
        {
          added: true,
          newScreenshot: 'base64-image',
          screenshotId: 'screenshot-id',
          storyId: 'story-id',
        },
      ],
      { requestId: 'request-id', requestType: 'all', storyId: 'story-id' },
    );
  });

  it('should call beforeAllImageDiff with data', async () => {
    await testScreenshots({
      requestId: 'request-id',
      requestType: 'all',
      storyId: 'story-id',
    });

    expect(beforeAllImageDiffMock).toHaveBeenCalledWith({
      requestId: 'request-id',
      requestType: 'all',
      storyId: 'story-id',
    });
  });

  it('should test all stories in a file', async () => {
    await testScreenshots({
      fileName: './stories/test.stories.tsx',
      requestId: 'request-id',
      requestType: 'file',
      storyId: 'story-id',
    });

    expect(testFileScreenshots).toHaveBeenCalledTimes(1);

    expect(testFileScreenshots).toHaveBeenCalledWith({
      disableEvans: true,
      fileName: './stories/test.stories.playwright.json',
      requestId: 'request-id',
      requestType: 'file',
      storyId: 'story-id',
    });
  });

  it('should test story within file only', async () => {
    await testScreenshots({
      fileName: './stories/test.stories.tsx',
      requestId: 'request-id',
      requestType: 'story',
      storyId: 'story-id',
    });
    expect(testFileScreenshots).toHaveBeenCalledTimes(1);

    expect(testFileScreenshots).toHaveBeenCalledWith({
      disableEvans: true,
      fileName: './stories/test.stories.playwright.json',
      requestId: 'request-id',
      requestType: 'story',
      storyId: 'story-id',
    });
  });
});
