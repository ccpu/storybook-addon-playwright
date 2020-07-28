import { loadStoryData } from '../../utils';
import { saveScreenshot } from '../save-screenshot';
import { SaveScreenshotRequest } from '../../../typings';
import { setConfig } from '../../configs';
import { Page } from 'playwright-core';
import * as diffImageToScreenshot from '../diff-image-to-screenshot';
import { mocked } from 'ts-jest/utils';
import { deleteScreenshot } from '../delete-screenshot';
import { BrowserOptions } from '../../../../typings';
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
  return {
    added: true,
  };
});

describe('saveScreenshot', () => {
  const getData = (
    data?: Partial<SaveScreenshotRequest>,
  ): SaveScreenshotRequest => {
    return {
      actions: [
        {
          id: 'action-id',
          name: 'action-name',
        },
      ],
      base64: 'base64-image',
      browserOptions: { deviceName: 'iPhone 6' },
      browserType: 'chromium',
      fileName: 'story.ts',
      hash: 'hash',
      props: [{ name: 'prop', value: 'value' }],
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
          ['story-id']: {
            screenshots: [
              {
                browserType: 'chromium',
                hash: 'hash-2',
                title: 'foo',
              },
            ],
          },
        });
      });
    });

    await expect(
      saveScreenshot(getData({ title: 'foo' })),
    ).rejects.toThrowError();
  });

  it('should not have screenshot with the same setting (using hash for comparison)', async () => {
    loadStoryDataMock.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve({
          ['story-id']: {
            screenshots: [
              {
                browserType: 'chromium',
                hash: 'hash-1',
                title: 'bar',
              },
            ],
          },
        });
      });
    });

    await expect(
      saveScreenshot(getData({ hash: 'hash-1', title: 'foo' })),
    ).rejects.toThrowError();
  });

  it('should not save if dealing with existing screen shot', async () => {
    loadStoryDataMock.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve({
          ['story-id']: {
            screenshots: [getData()],
          },
        });
      });
    });

    mockDiffImageToScreenshot.diffImageToScreenshot.mockImplementationOnce(
      () => {
        return {
          pass: true,
        };
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
        actions: [],
        browserOptions: {} as BrowserOptions,
        hash: 'hash-3',
        props: [],
      }),
    );

    const data = mocked(saveStoryFile).mock.calls[0][1]['story-id'][
      'screenshots'
    ][2];

    expect(data.actions).toBe(undefined);
    expect(data.props).toBe(undefined);
    expect(data.browserOptions).toBe(undefined);
  });

  it('should update screenshot', async () => {
    const result = await saveScreenshot(
      getData({
        updateScreenshot: {
          browserType: 'chromium',
          hash: 'hash',
          title: 'title',
        },
      }),
    );
    // should delete old screenshot file
    expect(mocked(deleteScreenshot)).toHaveBeenCalledWith({
      fileName: 'story.ts',
      hash: 'hash',
      storyId: 'story-id',
    });

    expect(result).toStrictEqual({ added: true, index: undefined });
  });

  it('should change actions id to prevent react duplicated key when editing screenshot', async () => {
    const data = getData({
      actions: [{ id: 'action-id', name: 'click' }],
      updateScreenshot: {
        browserType: 'chromium',
        hash: 'hash',
        title: 'title',
      },
    });

    await saveScreenshot(data);

    const newId = mocked(saveStoryFile).mock.calls[0][1]['story-id']
      .screenshots[1].actions[0].id;

    expect(newId === 'action-id').toBeFalsy();
  });
});
