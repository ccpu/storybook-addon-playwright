import { testAppScreenshots } from '../test-app-screenshots';

jest.mock('../make-screenshot');
jest.mock('../../utils/load-story-data');
jest.mock('../diff-image-to-screenshot');

describe('testAppScreenshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
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
});
