import { storyData } from '../../../../../__test_data__/story-data';
import { saveStoryFile } from '../../utils/save-story-file';
import { fixScreenshotFileName } from '../fix-screenshot-file-name';
import { getStoryPlaywrightDataByFileName } from '../utils/get-story-playwright-data-by-file-name';
import fs from 'fs';
import path from 'path';
import { PlaywrightData } from '../../../../typings';
import { getStoryPlaywrightFileInfo } from '../../utils/get-story-playwright-file-info';

vi.mock('fs');
const existsSyncMock = vi.spyOn(fs, 'existsSync');

vi.mock('../utils/get-story-playwright-data-by-file-name');
vi.mock('../../utils/save-story-file');
vi.mock('../../utils/get-story-playwright-file-info');

vi.mocked(getStoryPlaywrightFileInfo).mockReturnValue({
  dir: 'dir',
  name: 'fileName',
  path: 'filePath',
  screenShotsDir: 'screenShots-dir',
});

const configs: PlaywrightData = {
  stories: {
    'story-title--func-name': {
      screenshots: [
        {
          browserType: 'chromium',
          id: 'screenshotId',
          title: 'screenshot-title',
        },
      ],
    },
  },
};

vi.mocked(getStoryPlaywrightDataByFileName).mockImplementation(() => {
  return new Promise((resolve) => {
    resolve(configs);
  });
});

describe('fixScreenshotFileName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fs as any).__setMockFiles({ component: ['component.png'] });
  });

  it('should be defined', () => {
    expect(fixScreenshotFileName).toBeDefined();
  });

  describe('fix story title change', () => {
    it('should apply change', async () => {
      vi.mocked(existsSyncMock).mockReturnValueOnce(true);
      await fixScreenshotFileName({ ...storyData, parent: 'new-title' });
      expect(getStoryPlaywrightDataByFileName).toHaveBeenCalledWith(
        './test.stories.tsx',
      );
      expect(vi.mocked(saveStoryFile).mock.calls[0][1]).toStrictEqual({
        stories: {
          'new-title--func-name': {
            screenshots: [
              {
                browserType: 'chromium',
                id: 'screenshotId',
                title: 'screenshot-title',
              },
            ],
          },
        },
      });
      expect(fs.renameSync).toHaveBeenCalledWith(
        path.join(
          'screenShots-dir',
          'story-title-func-name-screenshot-title-chromium-snap.png',
        ),
        path.join(
          'screenShots-dir',
          'new-title-func-name-screenshot-title-chromium-snap.png',
        ),
      );
    });

    it('should merge if new screenshot added before applying fix', async () => {
      vi.mocked(getStoryPlaywrightDataByFileName).mockImplementation(() => {
        return new Promise((resolve) => {
          resolve({
            stories: {
              'new-title--func-name': {
                screenshots: [
                  {
                    browserType: 'chromium',
                    id: 'screenshotId_2',
                    title: 'screenshot-title-2',
                  },
                ],
              },
              'story-title--func-name': {
                screenshots: [
                  {
                    browserType: 'chromium',
                    id: 'screenshotId',
                    title: 'screenshot-title',
                  },
                ],
              },
            },
          });
        });
      });
      await fixScreenshotFileName({ ...storyData, parent: 'new-title' });

      expect(vi.mocked(saveStoryFile).mock.calls[0][1]).toStrictEqual({
        stories: {
          'new-title--func-name': {
            screenshots: [
              {
                browserType: 'chromium',
                id: 'screenshotId',
                title: 'screenshot-title',
              },
              {
                browserType: 'chromium',
                id: 'screenshotId_2',
                title: 'screenshot-title-2',
              },
            ],
          },
        },
      });
    });
  });

  describe('fix named export change', () => {
    it('should apply export function change', async () => {
      await fixScreenshotFileName({
        ...storyData,
        id: 'story--new-id',
        previousNamedExport: 'func-name',
      });

      expect(vi.mocked(saveStoryFile).mock.calls[0][1]).toStrictEqual({
        stories: {
          'component--new-id': {
            screenshots: [
              {
                browserType: 'chromium',
                id: 'screenshotId',
                title: 'screenshot-title',
              },
              {
                browserType: 'chromium',
                id: 'screenshotId_2',
                title: 'screenshot-title-2',
              },
            ],
          },
        },
      });
    });

    it('should handle story with no screenshots', async () => {
      vi.mocked(getStoryPlaywrightDataByFileName).mockImplementationOnce(() => {
        return new Promise((resolve) => {
          resolve({
            stories: {
              'story-title--func-name': {},
            },
          });
        });
      });

      await fixScreenshotFileName({
        ...storyData,
        id: 'story--new-id',
        previousNamedExport: 'func-name',
      });

      expect(vi.mocked(saveStoryFile).mock.calls[0][1]).toStrictEqual({
        stories: {
          'component--new-id': {},
        },
      });
    });

    it('should throw if unable to locate old stories', async () => {
      await expect(
        fixScreenshotFileName({
          ...storyData,
          previousNamedExport: 'bad-name',
        }),
      ).rejects.toThrow();
    });
  });
});
