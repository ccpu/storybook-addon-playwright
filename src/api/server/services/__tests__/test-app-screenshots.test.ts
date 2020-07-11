import { defaultConfigs } from '../../../../../__test_data__/configs';
import { testAppScreenshots } from '../test-app-screenshots';
import { getConfigs } from '../../configs';
import { mocked } from 'ts-jest/utils';

jest.mock('../make-screenshot');
jest.mock('../../utils/load-story-data');
jest.mock('../diff-image-to-screenshot');
jest.mock('../../configs');

const afterAppImageDiffMock = jest.fn();
mocked(getConfigs).mockImplementation(() => ({
  afterAppImageDiff: afterAppImageDiffMock,
  ...defaultConfigs(),
}));

describe('testAppScreenshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have result', async () => {
    const result = await testAppScreenshots();
    expect(result).toStrictEqual([
      {
        added: true,
        newScreenshot: 'base64-image',
        screenshotHash: 'hash',
        storyId: 'story-id',
      },
      {
        added: true,
        newScreenshot: 'base64-image',
        screenshotHash: 'hash-2',
        storyId: 'story-id',
      },
    ]);
  });

  it('should call afterAppImageDiffMock with result', async () => {
    await testAppScreenshots();
    expect(afterAppImageDiffMock).toHaveBeenCalledWith([
      {
        added: true,
        newScreenshot: 'base64-image',
        screenshotHash: 'hash',
        storyId: 'story-id',
      },
      {
        added: true,
        newScreenshot: 'base64-image',
        screenshotHash: 'hash-2',
        storyId: 'story-id',
      },
    ]);
  });
});
