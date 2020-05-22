import { spyOnLoadStoryData } from '../../../../../__manual_mocks__/utils/load-story-data';
import { saveScreenshot } from '../save-screenshot';
import { SaveScreenshotRequest } from '../../../typings';

describe('saveScreenshot', () => {
  const getData = (data?: SaveScreenshotRequest): SaveScreenshotRequest => {
    return {
      base64: 'base64-image',
      browserType: 'chromium',
      fileName: 'story.ts',
      hash: 'hash',
      storyId: 'story-id',
      title: 'screenshot-title',
      ...data,
    };
  };

  beforeAll(() => {
    (global as any).UNSTABLE_SKIP_REPORTING = true;
  });

  afterAll(() => {
    (global as any).UNSTABLE_SKIP_REPORTING = false;
  });

  beforeEach(() => {
    spyOnLoadStoryData.mockClear();
  });

  it('should create new file and save data', () => {
    const result = saveScreenshot(getData());
    expect(result).toStrictEqual(undefined);
  });
});
