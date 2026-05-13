import type { AddonState, BrowserTypes, ScreenShotViewPanel } from '../../src/typings';
import { act, renderHook } from '@testing-library/react-hooks';
import { STORY_RENDERED } from '@storybook/core-events';
import { addons } from '@storybook/manager-api';

type AddonStateSeed = Omit<AddonState, 'disabledBrowser'> & {
  disabledBrowser?: AddonState['disabledBrowser'];
};

const storeMocks = vi.hoisted(() => {
  let subscriber: ((state: any, previousState: any) => void) | undefined;
  const unsubscribe = vi.fn();

  return {
    subscribe: vi.fn((listener: typeof subscriber) => {
      subscriber = listener;
      return unsubscribe;
    }),
    setAddonState: vi.fn(),
    unsubscribe,
    getSubscriber: () => subscriber,
    clearSubscriber: () => {
      subscriber = undefined;
    },
  };
});

let addonStateSeed: AddonStateSeed = {
  placement: 'auto',
  previewPanelSize: 100,
  clippingWarningDismissed: false,
  previewPanelEnabled: true,
};

vi.mock('../../src/store', () => ({
  useUIStore: {
    subscribe: storeMocks.subscribe,
  },
}));

vi.mock('../../src/hooks/use-addon-state', async () => {
  const React = await import('react');

  return {
    useAddonState: () => {
      const [addonState, setAddonStateState] = React.useState(
        () => JSON.parse(JSON.stringify(addonStateSeed)) as AddonState,
      );

      return {
        addonState,
        setAddonState: (nextState: AddonState) => {
          storeMocks.setAddonState(nextState);
          setAddonStateState(nextState);
        },
      };
    },
  };
});

import { useBrowserStateManager } from '../../src/hooks/use-browser-state-manager';

const defaultBrowsers: BrowserTypes[] = ['chromium', 'firefox', 'webkit'];

function renderActiveBrowsers(browserView: ScreenShotViewPanel) {
  return renderHook(() => useBrowserStateManager(browserView));
}

function getLastAddonStateCall() {
  const lastCallIndex = storeMocks.setAddonState.mock.calls.length - 1;
  return storeMocks.setAddonState.mock.calls[lastCallIndex]?.[0] as
    | AddonState
    | undefined;
}

function emitStoreChange(state: any, previousState: any) {
  const subscriber = storeMocks.getSubscriber();

  expect(subscriber).toBeDefined();

  act(() => {
    subscriber?.(state, previousState);
  });
}

describe('useActiveBrowsers', () => {
  beforeEach(() => {
    addonStateSeed = {
      placement: 'auto',
      previewPanelSize: 100,
      clippingWarningDismissed: false,
      previewPanelEnabled: true,
    };
    storeMocks.subscribe.mockClear();
    storeMocks.setAddonState.mockClear();
    storeMocks.unsubscribe.mockClear();
    storeMocks.clearSubscriber();
  });

  it('should expose the default browser list and handle a missing disabledBrowser map', () => {
    const { result } = renderActiveBrowsers('dialog');

    expect(result.current.browserTypes).toStrictEqual(defaultBrowsers);
    expect(result.current.activeBrowsers).toStrictEqual(defaultBrowsers);
    expect(result.current.isDisabled('chromium')).toBe(false);

    act(() => {
      result.current.toggleBrowser('chromium');
    });

    expect(result.current.isDisabled('chromium')).toBe(true);
    expect(result.current.refreshingBrowsers).toStrictEqual([]);
    expect(getLastAddonStateCall()).toMatchObject({
      placement: 'auto',
      previewPanelSize: 100,
      disabledBrowser: {
        dialog: {
          chromium: true,
        },
      },
    });

    act(() => {
      result.current.toggleBrowser('chromium');
    });

    expect(result.current.isDisabled('chromium')).toBe(false);
    expect(result.current.refreshingBrowsers).toStrictEqual(['chromium']);
    expect(getLastAddonStateCall()).toMatchObject({
      placement: 'auto',
      previewPanelSize: 100,
      disabledBrowser: {
        dialog: {
          chromium: false,
        },
      },
    });

    act(() => {
      result.current.clearBrowserRefresh('chromium');
    });

    expect(result.current.refreshingBrowsers).toStrictEqual([]);
  });

  it('should preserve existing browser flags when toggling a different panel browser', () => {
    addonStateSeed = {
      placement: 'auto',
      previewPanelSize: 100,
      clippingWarningDismissed: false,
      previewPanelEnabled: true,
      disabledBrowser: {
        main: {
          firefox: true,
        },
        dialog: {
          firefox: true,
        },
      },
    };

    const { result } = renderActiveBrowsers('dialog');

    act(() => {
      result.current.toggleBrowser('chromium');
    });

    expect(getLastAddonStateCall()).toMatchObject({
      placement: 'auto',
      previewPanelSize: 100,
      disabledBrowser: {
        main: {
          firefox: true,
        },
        dialog: {
          firefox: true,
          chromium: true,
        },
      },
    });
  });

  it('should refresh browsers from store changes and clean up the subscription', () => {
    const { result, unmount } = renderActiveBrowsers('dialog');

    emitStoreChange(
      {
        browserOptions: {
          all: {},
          chromium: { viewport: { width: 1200, height: 900 } },
          firefox: {},
          webkit: {},
        },
        screenshotOptions: {},
      },
      {
        browserOptions: {
          all: {},
          chromium: {},
          firefox: {},
          webkit: {},
        },
        screenshotOptions: {},
      },
    );

    expect(result.current.refreshingBrowsers).toStrictEqual(['chromium']);

    emitStoreChange(
      {
        browserOptions: {
          all: { defaultBrowserType: 'webkit' },
          chromium: { viewport: { width: 1200, height: 900 } },
          firefox: { viewport: { width: 1000, height: 800 } },
          webkit: {},
        },
        screenshotOptions: { darkMode: true },
      },
      {
        browserOptions: {
          all: {},
          chromium: { viewport: { width: 1200, height: 900 } },
          firefox: {},
          webkit: {},
        },
        screenshotOptions: {},
      },
    );

    expect(result.current.refreshingBrowsers).toStrictEqual(defaultBrowsers);

    unmount();

    expect(storeMocks.subscribe).toHaveBeenCalledTimes(1);
    expect(storeMocks.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should refresh active browsers after STORY_RENDERED', () => {
    const { result } = renderActiveBrowsers('dialog');

    act(() => {
      result.current.toggleBrowser('firefox');
    });

    expect(result.current.activeBrowsers).toStrictEqual(['chromium', 'webkit']);
    expect(result.current.refreshingBrowsers).toStrictEqual([]);

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addons as any).__setEvent(STORY_RENDERED, 'story-id');
    });

    expect(result.current.refreshingBrowsers).toStrictEqual(['chromium', 'webkit']);
  });
});
