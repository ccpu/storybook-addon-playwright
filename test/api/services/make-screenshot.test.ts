// Changed: vi.mock is hoisted above const declarations, causing TDZ when the
// factory references top-level variables. Wrap mocks with vi.hoisted() so the
// values are available before imports are resolved. (vitest ESM hoisting issue)
const { sharpMock, compositeMock, joinImagesMock } = vi.hoisted(() => {
  const compositeMock = vi.fn();
  compositeMock.mockImplementation(() => ({
    toFormat: () => ({
      toBuffer: () => 'buffer-data',
    }),
  }));
  const sharpMock = vi.fn();
  sharpMock.mockImplementation(() => ({
    composite: compositeMock,
  }));
  const joinImagesMock = vi.fn();
  joinImagesMock.mockImplementation(() => ({
    toFormat: () => ({
      toBuffer: () => 'buffer-data',
    }),
  }));
  return { compositeMock, joinImagesMock, sharpMock };
});
vi.mock('sharp', () => ({ default: sharpMock }));
// Changed: vitest requires ESM-compatible mock factories to return { default: fn }
// for default-export packages rather than the function directly.
vi.mock('join-images', () => ({ default: joinImagesMock }));

import { makeScreenshot } from '../../../src/api/services/make-screenshot';
import { getConfigs } from '../../../src/api/server/configs';
import { defaultConfigs } from '../../configs/configs';
import { executeAction } from '../../../src/api/server/utils/execute-action';
import { installMouseHelper } from '../../../src/api/server/utils/install-mouse-helper';
import { releaseModifierKey } from '../../../src/api/services/utils/release-modifier-Key';

import { Page } from 'playwright';

vi.mock(
  '../../../src/api/server/configs',
  async () => await import('../server/__mocks__/configs'),
);
vi.mock(
  '../../../src/api/server/utils/execute-action',
  async () => await import('../server/utils/__mocks__/execute-action'),
);
vi.mock(
  '../../../src/api/server/utils/install-mouse-helper.ts',
  async () => await import('../server/utils/__mocks__/install-mouse-helper'),
);
vi.mock('../../../src/api/services/utils/release-modifier-Key');

const getConfigsMock = vi.mocked(getConfigs);

const getPageMock = vi.fn();

const screenshotMock = vi.fn();
const gotoMock = vi.fn();

screenshotMock.mockImplementation(() => {
  return new Promise((resolve) => {
    resolve('buffer-data' as unknown as Buffer);
  });
});

getPageMock.mockImplementation(() => {
  return new Promise((resolve) => {
    resolve({
      goto: gotoMock,
      screenshot: screenshotMock,
    } as unknown as Page);
  });
});

getConfigsMock.mockImplementation(() => {
  return defaultConfigs({
    getPage: getPageMock,
  });
});

describe('makeScreenshot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it('should pass args into story url', async () => {
    await makeScreenshot({
      args: { label: 'Hello' },
      browserType: 'chromium',
      requestId: 'request-id',
      storyId: 'story-id',
    });

    expect(gotoMock.mock.calls[0][0]).toContain('&args=label:Hello');
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
    const beforeSnapshotMock = vi.fn();

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
    const afterSnapshotMock = vi.fn();
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
    const afterUrlConstructionMock = vi.fn();
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
    const afterNavigation = vi.fn();
    getConfigsMock.mockImplementationOnce(() => {
      return defaultConfigs({
        afterNavigation,
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

  it('should take 1 screenshots with stitch as default merge process', async () => {
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
    expect(screenshotMock).toBeCalledTimes(1);
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
                } as unknown as Record<string, unknown>,
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
    expect(joinImagesMock).toHaveBeenCalledWith(['buffer-data'], {});
    expect(screenshotMock).toBeCalledTimes(1);
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
                } as unknown as Record<string, unknown>,
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
                } as unknown as Record<string, unknown>,
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
                args: {} as unknown as Record<string, unknown>,
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
                } as unknown as Record<string, unknown>,
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
                args: {} as unknown as Record<string, unknown>,
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
                } as unknown as Record<string, unknown>,
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

    expect(joinImagesMock).toHaveBeenCalledWith(['buffer-data'], {
      direction: 'horizontal',
    });
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
