import { defaultConfigs } from '../../../../../__test_data__/configs';
import { testScreenshots } from '../test-screenshots-service';
import { getConfigs } from '../../configs';
import { mocked } from 'ts-jest/utils';
import { testFileScreenshots } from '../test-file-screenshots';

jest.mock('../make-screenshot');
jest.mock('../../utils/load-story-data');
jest.mock('../../configs');
jest.mock('../test-file-screenshots');
jest.mock('../../../../utils/get-playwright-config-files');

const afterAllImageDiffMock = jest.fn();
const beforeAllImageDiffMock = jest.fn();

mocked(getConfigs).mockImplementation(() => ({
  afterAllImageDiff: afterAllImageDiffMock,
  beforeAllImageDiff: beforeAllImageDiffMock,
  ...defaultConfigs(),
}));

mocked(testFileScreenshots).mockImplementation(() => {
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
    jest.clearAllMocks();
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
