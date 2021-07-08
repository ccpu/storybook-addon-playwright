const sharpMock = jest.fn();
const compositeMock = jest.fn();
compositeMock.mockImplementation(() => ({
  toFormat: () => ({
    toBuffer: () => 'buffer-data',
  }),
}));
sharpMock.mockImplementation(() => ({
  composite: compositeMock,
}));
jest.mock('sharp', () => sharpMock);

const joinImagesMock = jest.fn();
joinImagesMock.mockImplementation(() => ({
  toFormat: () => ({
    toBuffer: () => 'buffer-data',
  }),
}));
jest.mock('join-images', () => joinImagesMock);

import { makeScreenshot } from '../make-screenshot';
import { getConfigs } from '../../configs';
import { defaultConfigs } from '../../../../../__test_data__/configs';
import { mocked } from 'ts-jest/utils';
import { executeAction } from '../../utils/execute-action';
import { installMouseHelper } from '../../utils/install-mouse-helper';
import { releaseModifierKey } from '../utils/release-modifier-Key';

import { Page } from 'playwright';
import {
  TakeScreenshotOptionsParams,
  TakeScreenshotParams,
} from '../../../typings/';

jest.mock('../../configs');
jest.mock('../../utils/execute-action');
jest.mock('../../utils/install-mouse-helper.ts');
jest.mock('../utils/release-modifier-Key');

const getConfigsMock = mocked(getConfigs);

const getPageMock = jest.fn();

const screenshotMock = jest.fn();

screenshotMock.mockImplementation(() => {
  return new Promise((resolve) => {
    resolve(('buffer-data' as unknown) as Buffer);
  });
});

getPageMock.mockImplementation(() => {
  return new Promise((resolve) => {
    resolve(({
      goto: jest.fn(),
      screenshot: screenshotMock,
    } as unknown) as Page);
  });
});

getConfigsMock.mockImplementation(() => {
  return defaultConfigs({
    getPage: getPageMock,
  });
});

describe('makeScreenshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw if no page returned', async () => {
    getConfigsMock.mockImplementationOnce(() => {
      return defaultConfigs({
        getPage: async () => {
          return new Promise((resolve) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            resolve();
          });
        },
      });
    });

    await expect(
      makeScreenshot({
        browserType: 'chromium',
        requestId: 'request-id',
        storyId: 'story-id',
      }),
    ).rejects.toThrowError(
      'Make sure to return an instance of a page from getPage.',
    );
  });

  it('should make screenshot', async () => {
    const screenshot = await makeScreenshot({
      browserType: 'chromium',
      requestId: 'request-id',
      storyId: 'story-id',
    });
    expect(screenshot.buffer).toBeDefined();
  });

  it('should call to release modifier keys after screenshot', async () => {
    getConfigsMock.mockImplementationOnce(() => {
      return defaultConfigs({
        releaseModifierKey: true,
      });
    });

    await makeScreenshot({
      browserType: 'chromium',
      requestId: 'request-id',
      storyId: 'story-id',
    });

    expect(releaseModifierKey).toHaveBeenCalledTimes(1);
  });

  it('should convert to base64', async () => {
    const screenshot = await makeScreenshot(
      { browserType: 'chromium', requestId: 'request-id', storyId: 'story-id' },
      true,
    );
    expect(screenshot.base64).toBe('buffer-data');
  });

  it('should execute actions', async () => {
    await makeScreenshot(
      {
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
        browserType: 'chromium',
        requestId: 'request-id',
        storyId: 'story-id',
      },
      true,
    );
    expect(executeAction).toBeCalledTimes(1);
  });

  it('should call beforeSnapshotMock', async () => {
    const beforeSnapshotMock = jest.fn();

    getConfigsMock.mockImplementationOnce(() => {
      return defaultConfigs({
        beforeScreenshot: beforeSnapshotMock,
        getPage: getPageMock,
      });
    });

    await makeScreenshot(
      {
        browserType: 'chromium',
        requestId: 'request-id',
        storyId: 'story-id',
      },
      true,
    );
    expect(beforeSnapshotMock).toBeCalledTimes(1);
  });

  it('should call afterSnapshot', async () => {
    const afterSnapshotMock = jest.fn();
    getConfigsMock.mockImplementationOnce(() => {
      return defaultConfigs({
        afterScreenshot: afterSnapshotMock,
        getPage: getPageMock,
      });
    });

    await makeScreenshot(
      {
        browserType: 'chromium',
        requestId: 'request-id',
        storyId: 'story-id',
      },
      true,
    );
    expect(afterSnapshotMock).toBeCalledTimes(1);
  });

  it('should call afterUrlConstruction', async () => {
    const afterUrlConstructionMock = jest.fn();
    getConfigsMock.mockImplementationOnce(() => {
      return defaultConfigs({
        afterUrlConstruction: afterUrlConstructionMock,
        getPage: getPageMock,
      });
    });

    await makeScreenshot(
      {
        browserType: 'chromium',
        requestId: 'request-id',
        storyId: 'story-id',
      },
      true,
    );
    expect(afterUrlConstructionMock).toBeCalledTimes(1);
  });

  it('should call afterNavigation', async () => {
    const afterNavigation = jest.fn();
    getConfigsMock.mockImplementationOnce(() => {
      return defaultConfigs({
        afterNavigation: afterNavigation,
        getPage: getPageMock,
      });
    });

    await makeScreenshot(
      {
        browserType: 'chromium',
        requestId: 'request-id',
        storyId: 'story-id',
      },
      true,
    );
    expect(afterNavigation).toBeCalledTimes(1);
  });

  it('should install mouse helper', async () => {
    await makeScreenshot(
      {
        browserOptions: {
          cursor: true,
        },
        browserType: 'chromium',
        requestId: 'request-id',
        storyId: 'story-id',
      },
      true,
    );
    expect(installMouseHelper).toBeCalledTimes(1);
  });

  it('should take 2 screenshots with stitch as default merge process', async () => {
    await makeScreenshot(
      {
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
          {
            actions: [
              {
                id: 'takeScreenshot-id',
                name: 'takeScreenshot',
              },
            ],
            id: 'action-set-id-2',
            title: 'action-set-title-2',
          },
        ],
        browserType: 'chromium',
        requestId: 'request-id',
        storyId: 'story-id',
      },
      true,
    );

    expect(joinImagesMock).toHaveBeenCalledTimes(1);
    expect(screenshotMock).toBeCalledTimes(2);
  });

  it('should take 2 screenshots with stitch for merge process', async () => {
    await makeScreenshot(
      {
        actionSets: [
          {
            actions: [
              {
                args: {
                  mergeType: 'stitch',
                } as TakeScreenshotOptionsParams,
                id: 'action-id',
                name: 'takeScreenshotOptions',
              },
            ],
            id: 'action-set-id',
            title: 'action-set-title',
          },
          {
            actions: [
              {
                id: 'takeScreenshot-id',
                name: 'takeScreenshot',
              },
            ],
            id: 'action-set-id-2',
            title: 'action-set-title-2',
          },
        ],
        browserType: 'chromium',
        requestId: 'request-id',
        storyId: 'story-id',
      },
      true,
    );

    expect(sharpMock).toHaveBeenCalledTimes(0);
    expect(joinImagesMock).toHaveBeenCalledWith(
      ['buffer-data', 'buffer-data'],
      {},
    );
    expect(screenshotMock).toBeCalledTimes(2);
  });

  it('should overwrite takeScreenshotOptions by takeScreenshot options when overlay merging', async () => {
    await makeScreenshot(
      {
        actionSets: [
          {
            actions: [
              {
                args: {
                  mergeType: 'overlay',
                  overlayOptions: {
                    blend: 'clear',
                  },
                } as TakeScreenshotOptionsParams,
                id: 'takeScreenshotOptions-id',
                name: 'takeScreenshotOptions',
              },
            ],
            id: 'action-set-id',
            title: 'action-set-title',
          },
          {
            actions: [
              {
                args: {
                  stitchOptions: {
                    blend: 'add',
                  },
                } as TakeScreenshotParams,
                id: 'takeScreenshot-id',
                name: 'takeScreenshot',
              },
            ],
            id: 'action-set-id',
            title: 'action-set-title',
          },
        ],
        browserType: 'chromium',
        requestId: 'request-id',
        storyId: 'story-id',
      },
      true,
    );

    expect(compositeMock).toHaveBeenCalledWith([
      { blend: 'add', input: 'buffer-data' },
    ]);
  });

  it('should apply config default screenshot options', async () => {
    getConfigsMock.mockImplementationOnce(() => {
      return defaultConfigs({
        getPage: getPageMock,
        screenshotOptions: {
          mergeType: 'overlay',
          overlayOptions: { blend: 'xor' },
        },
      });
    });
    await makeScreenshot(
      {
        actionSets: [
          {
            actions: [
              {
                args: {} as TakeScreenshotParams,
                id: 'takeScreenshot-id',
                name: 'takeScreenshot',
              },
            ],
            id: 'action-set-id',
            title: 'action-set-title',
          },
        ],
        browserType: 'chromium',
        requestId: 'request-id',
        storyId: 'story-id',
      },
      true,
    );

    expect(compositeMock).toHaveBeenCalledWith([
      { blend: 'xor', input: 'buffer-data' },
    ]);
  });

  it('should overwrite config default screenshot options', async () => {
    getConfigsMock.mockImplementationOnce(() => {
      return defaultConfigs({
        getPage: getPageMock,
        screenshotOptions: {
          mergeType: 'stitch',
          overlayOptions: { blend: 'xor' },
        },
      });
    });
    await makeScreenshot(
      {
        actionSets: [
          {
            actions: [
              {
                args: {
                  mergeType: 'overlay',
                  overlayOptions: {
                    blend: 'clear',
                  },
                } as TakeScreenshotOptionsParams,
                id: 'takeScreenshotOptions-id',
                name: 'takeScreenshotOptions',
              },
            ],
            id: 'action-set-id',
            title: 'action-set-title',
          },
          {
            actions: [
              {
                args: {} as TakeScreenshotParams,
                id: 'takeScreenshot-id',
                name: 'takeScreenshot',
              },
            ],
            id: 'action-set-id',
            title: 'action-set-title',
          },
        ],
        browserType: 'chromium',
        requestId: 'request-id',
        storyId: 'story-id',
      },
      true,
    );

    expect(compositeMock).toHaveBeenCalledWith([
      { blend: 'clear', input: 'buffer-data' },
    ]);
  });

  it('should apply takeScreenshotOptions options to takeScreenshot options when stitch merging', async () => {
    await makeScreenshot(
      {
        actionSets: [
          {
            actions: [
              {
                args: {
                  mergeType: 'stitch',
                  stitchOptions: {
                    direction: 'horizontal',
                  },
                } as TakeScreenshotOptionsParams,
                id: 'takeScreenshotOptions-id',
                name: 'takeScreenshotOptions',
              },
            ],
            id: 'action-set-id',
            title: 'action-set-title',
          },
          {
            actions: [
              {
                id: 'takeScreenshot-id',
                name: 'takeScreenshot',
              },
            ],
            id: 'action-set-id',
            title: 'action-set-title',
          },
        ],
        browserType: 'chromium',
        requestId: 'request-id',
        storyId: 'story-id',
      },
      true,
    );

    expect(joinImagesMock).toHaveBeenCalledWith(
      ['buffer-data', 'buffer-data'],
      { direction: 'horizontal' },
    );
  });

  it('should take 3 screenshot for all actions', async () => {
    await makeScreenshot(
      {
        actionSets: [
          {
            actions: [
              {
                id: 'action-id',
                name: 'click',
              },
              {
                id: 'action-id',
                name: 'hover',
              },
              {
                id: 'action-id',
                name: 'takeScreenshotAll',
              },
            ],
            id: 'action-set-id',
            title: 'action-set-title',
          },
        ],
        browserType: 'chromium',
        requestId: 'request-id',
        storyId: 'story-id',
      },
      true,
    );

    // 1: after page load
    // 2: click
    // 3: hover

    expect(joinImagesMock).toHaveBeenCalledWith(
      ['buffer-data', 'buffer-data', 'buffer-data'],
      {},
    );
  });

  it('should take no screenshot when takeScreenshotAll is enable but no proper action provided', async () => {
    await makeScreenshot(
      {
        actionSets: [
          {
            actions: [
              {
                id: 'action-id',
                name: 'waitForSelector',
              },
              {
                id: 'action-id',
                name: 'waitForTimeout',
              },
              {
                id: 'action-id',
                name: 'takeScreenshotAll',
              },
            ],
            id: 'action-set-id',
            title: 'action-set-title',
          },
        ],
        browserType: 'chromium',
        requestId: 'request-id',
        storyId: 'story-id',
      },
      true,
    );

    expect(joinImagesMock).toHaveBeenCalledTimes(0);
  });
});
