import { loadStoryData } from '../../utils';
import { saveScreenshot } from '../save-screenshot';
import { SaveScreenshotRequest } from '../../../typings';
import { setConfig } from '../../configs';
import { Page } from 'playwright-core';
import * as diffImageToScreenshot from '../diff-image-to-screenshot';
import { mocked } from 'ts-jest/utils';
import { deleteScreenshot } from '../delete-screenshot';
import { BrowserContextOptions } from '../../../../typings';
import { saveStoryFile } from '../../utils';

jest.mock('../diff-image-to-screenshot');
jest.mock('../delete-screenshot');
jest.mock('../../utils/load-story-data');
jest.mock('../../utils/save-story-file');

const loadStoryDataMock = mocked(loadStoryData);

const mockDiffImageToScreenshot = diffImageToScreenshot as jest.Mocked<
  typeof diffImageToScreenshot
>;
mockDiffImageToScreenshot.diffImageToScreenshot.mockImplementation(() => {
  return new Promise((resolve) => {
    resolve({
      added: true,
    });
  });
});

describe('saveScreenshot', () => {
  const getData = (
    data?: Partial<SaveScreenshotRequest>,
  ): SaveScreenshotRequest => {
    return {
      actionSets: [
        {
          actions: [
            {
              id: 'action-id',
              name: 'action-name',
            },
          ],
          id: 'action-set-id',
          title: 'action-set-title',
        },
      ],
      base64: 'base64-image',
      browserOptions: { deviceName: 'iPhone 6' },
      browserType: 'chromium',
      fileName: 'story.ts',
      id: 'screenshot-id',
      screenshotOptions: { fullPage: true },
      storyId: 'story-id',
      title: 'screenshot-title',
      ...data,
    };
  };

  setConfig({
    getPage: async () => {
      return {} as Page;
    },
    storybookEndpoint: 'localhost',
  });

  beforeEach(() => {
    loadStoryDataMock.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve({
          stories: {
            ['story-id']: {
              screenshots: [getData()],
            },
          },
        });
      });
    });
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should create new file and save data', async () => {
    loadStoryDataMock.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve({});
      });
    });
    const result = await saveScreenshot(getData());
    expect(result).toStrictEqual({ added: true, index: 0 });
    expect(saveStoryFile).toHaveBeenCalledTimes(1);
  });

  it('should not allow duplicate title', async () => {
    loadStoryDataMock.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve({
          stories: {
            ['story-id']: {
              screenshots: [
                {
                  browserType: 'chromium',
                  id: 'screenshot-id-2',
                  title: 'foo',
                },
              ],
            },
          },
        });
      });
    });

    await expect(
      saveScreenshot(getData({ title: 'foo' })),
    ).rejects.toThrowError();
  });

  it('should not have screenshot with the same setting', async () => {
    await expect(
      saveScreenshot(getData({ id: 'screenshot-id-3', title: 'tets-title' })),
    ).rejects.toThrowError();
  });

  it('should not save if dealing with existing screenshot', async () => {
    mockDiffImageToScreenshot.diffImageToScreenshot.mockImplementationOnce(
      () => {
        return new Promise((resolve) => {
          resolve({
            pass: true,
          });
        });
      },
    );

    const result = await saveScreenshot(getData());

    expect(saveStoryFile).toHaveBeenCalledTimes(0);

    expect(result).toStrictEqual({
      oldScreenShotTitle: 'screenshot-title',
      pass: true,
    });
  });

  it('should not allow empty array/object', async () => {
    await saveScreenshot(
      getData({
        actionSets: [],
        browserOptions: {} as BrowserContextOptions,
        id: 'screenshot-id-3',
        props: {},
        title: 'new title',
      }),
    );

    const mockData = mocked(saveStoryFile).mock;

    const data = mockData.calls[0][1].stories['story-id'].screenshots[1];

    expect(data.actionSets).toBe(undefined);
    expect(data.props).toBe(undefined);
    expect(data.browserOptions).toBe(undefined);
  });

  it('should update screenshot', async () => {
    const result = await saveScreenshot(
      getData({
        updateScreenshot: {
          browserType: 'chromium',
          id: 'screenshot-id',
          title: 'title',
        },
      }),
    );
    // should delete old screenshot file
    expect(mocked(deleteScreenshot)).toHaveBeenCalledWith({
      fileName: 'story.ts',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });

    expect(result).toStrictEqual({ added: true, index: undefined });
  });

  it('should change actions id to prevent react duplicated key when editing screenshot', async () => {
    const data = getData({
      actionSets: [
        {
          actions: [
            {
              id: 'action-id',
              name: 'action-title',
            },
          ],
          id: 'action-set-id',
          title: 'action-set-title',
        },
      ],
      updateScreenshot: {
        browserType: 'chromium',
        id: 'screenshot-id',
        title: 'title',
      },
    });

    await saveScreenshot(data);

    const mockData = mocked(saveStoryFile).mock;

    const newId =
      mockData.calls[0][1].stories['story-id'].screenshots[0].actionSets[0].id;

    expect(newId === 'action-id').toBeFalsy();
  });
});
