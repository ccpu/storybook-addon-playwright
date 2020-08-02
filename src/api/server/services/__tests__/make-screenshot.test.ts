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
import { Page } from 'playwright-core';
import {
  TakeScreenshotOptionsParams,
  TakeScreenshotParams,
} from '../typings/types';

jest.mock('../../configs');
jest.mock('../../utils/execute-action');
jest.mock('../../utils/install-mouse-helper.ts');

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
        actions: [
          {
            id: 'action-id',
            name: 'action-name',
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

  it('should take 2 screenshots with overlay as default merge process', async () => {
    await makeScreenshot(
      {
        actions: [
          {
            id: 'action-id',
            name: 'action-name',
          },
          {
            id: 'takeScreenshot-id',
            name: 'takeScreenshot',
          },
        ],
        browserType: 'chromium',
        requestId: 'request-id',
        storyId: 'story-id',
      },
      true,
    );

    expect(sharpMock).toHaveBeenCalledTimes(1);
    expect(compositeMock).toHaveBeenCalledWith([
      {
        blend: 'multiply',
        input: 'buffer-data',
      },
    ]);
    expect(screenshotMock).toBeCalledTimes(2);
  });

  it('should take 2 screenshots with stitch for merge process', async () => {
    await makeScreenshot(
      {
        actions: [
          {
            args: {
              mergeType: 'stitch',
            } as TakeScreenshotOptionsParams,
            id: 'takeScreenshotOptions-id',
            name: 'takeScreenshotOptions',
          },
          {
            id: 'takeScreenshot-id',
            name: 'takeScreenshot',
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
      undefined,
    );
    expect(screenshotMock).toBeCalledTimes(2);
  });

  it('should overwrite takeScreenshotOptions options by takeScreenshot options when overlay merging', async () => {
    await makeScreenshot(
      {
        actions: [
          {
            args: {
              overlayOptions: {
                blend: 'clear',
              },
            } as TakeScreenshotOptionsParams,
            id: 'takeScreenshotOptions-id',
            name: 'takeScreenshotOptions',
          },
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

  it('should apply takeScreenshotOptions options to takeScreenshot options when stitch merging', async () => {
    await makeScreenshot(
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
          {
            id: 'takeScreenshot-id',
            name: 'takeScreenshot',
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
});
