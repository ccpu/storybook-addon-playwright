import { defaultConfigs } from '../../../../../__test_data__/configs';
import { testAppScreenshots } from '../test-app-screenshots';
import { getConfigs } from '../../configs';
import { mocked } from 'ts-jest/utils';
import { testScreenshots } from '../test-screenshots';

jest.mock('../make-screenshot');
jest.mock('../../utils/load-story-data');
jest.mock('../../configs');
jest.mock('../test-screenshots');

const afterAppImageDiffMock = jest.fn();
const beforeAppImageDiffMock = jest.fn();

mocked(getConfigs).mockImplementation(() => ({
  afterAppImageDiff: afterAppImageDiffMock,
  beforeAppImageDiff: beforeAppImageDiffMock,
  ...defaultConfigs(),
}));

mocked(testScreenshots).mockImplementation(() => {
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
    const result = await testAppScreenshots({ requestId: 'request-id' });
    expect(testScreenshots).toHaveBeenCalledWith({
      disableEvans: true,
      fileName: 'story.ts',
      requestId: 'request-id__0',
      requestType: 'app',
    });
    expect(result).toStrictEqual([
      {
        added: true,
        newScreenshot: 'base64-image',
        screenshotId: 'screenshot-id',
        storyId: 'story-id',
      },
    ]);
  });

  it('should call afterAppImageDiffMock with result', async () => {
    await testAppScreenshots({ requestId: 'request-id' });
    expect(afterAppImageDiffMock).toHaveBeenCalledWith(
      [
        {
          added: true,
          newScreenshot: 'base64-image',
          screenshotId: 'screenshot-id',
          storyId: 'story-id',
        },
      ],
      { requestId: 'request-id' },
    );
  });

  it('should call beforeAppImageDiff with data', async () => {
    await testAppScreenshots({ requestId: 'request-id' });
    expect(beforeAppImageDiffMock).toHaveBeenCalledWith({
      requestId: 'request-id',
    });
  });
});
