import { useBrowserStateManager } from '../../../../manual-mocks/hooks/use-browser-state-manager';
import { ScreenshotListView } from '../../../../../src/features/screenshot/components/screenshot-preview/ScreenshotListView';
import { shallow } from 'enzyme';
import React from 'react';
import { ScreenshotView } from '../../../../../src/features/screenshot/components/screenshot-preview/ScreenshotView';
import { Toolbar } from '../../../../../src/features/screenshot/components/screenshot-preview/Toolbar';
import { inputModal, Loader } from '../../../../../src/components/common';

const { saveScreenShotMock } = vi.hoisted(() => ({
  saveScreenShotMock: vi.fn(),
}));

vi.mock(
  '../../../../../src/features/screenshot/hooks/use-generate-screenshot-title',
  () => ({
    useGenerateScreenshotTitle: () => ({
      generateTitle: vi.fn(),
      hasGenerator: false,
    }),
  }),
);

vi.mock('../../../../../src/features/screenshot/hooks/use-save-screenshot', () => ({
  useSaveScreenshot: () => ({
    getUpdatingScreenshotTitle: vi.fn(),
    inProgress: false,
    saveScreenShot: saveScreenShotMock,
  }),
}));

describe('ScreenshotList', () => {
  const onCloseMock = vi.fn();
  const showModalMock = vi.spyOn(inputModal, 'show').mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    saveScreenShotMock.mockResolvedValue({});
  });

  it('should render', () => {
    const wrapper = shallow(
      <ScreenshotListView onClose={onCloseMock} viewPanel="dialog" />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should not have screenshot view if there is no active browser', () => {
    useBrowserStateManager.mockImplementationOnce(() => ({
      activeBrowsers: [],
      clearBrowserRefresh: vi.fn(),
      isDisabled: vi.fn(),
      refreshBrowsers: vi.fn(),
      refreshingBrowsers: [],
      toggleBrowser: vi.fn(),
    }));

    const wrapper = shallow(
      <ScreenshotListView onClose={onCloseMock} viewPanel="dialog" />,
    );

    const screenshotView = wrapper.find(ScreenshotView);
    expect(screenshotView.exists()).toBeFalsy();
  });

  it('should have screenshot view list', () => {
    const wrapper = shallow(
      <ScreenshotListView onClose={onCloseMock} viewPanel="dialog" />,
    );
    const screenshotView = wrapper.find(ScreenshotView);
    expect(screenshotView.exists()).toBeTruthy();
  });

  it('should show storybook story in screen shot view', () => {
    const wrapper = shallow(
      <ScreenshotListView
        onClose={onCloseMock}
        viewPanel="dialog"
        showStorybook={true}
      />,
    );
    const screenshotView = wrapper.find(ScreenshotView);
    expect(screenshotView.first().props().browserType).toBe('storybook');
  });

  it('should handle refresh', () => {
    const refreshBrowsersMock = vi.fn();

    useBrowserStateManager.mockImplementationOnce(() => ({
      activeBrowsers: ['chromium', 'firefox', 'webkit'],
      clearBrowserRefresh: vi.fn(),
      isDisabled: vi.fn(),
      refreshBrowsers: refreshBrowsersMock,
      refreshingBrowsers: [],
      toggleBrowser: vi.fn(),
    }));

    const wrapper = shallow(
      <ScreenshotListView onClose={onCloseMock} viewPanel="dialog" />,
    );
    const toolbar = wrapper.find(Toolbar);

    toolbar.props().onRefresh();

    expect(refreshBrowsersMock).toHaveBeenCalledWith(['chromium', 'firefox', 'webkit']);
  });

  it('should refresh a newly enabled browser', () => {
    useBrowserStateManager.mockImplementationOnce(() => ({
      activeBrowsers: ['chromium'],
      clearBrowserRefresh: vi.fn(),
      isDisabled: vi.fn(),
      refreshBrowsers: vi.fn(),
      refreshingBrowsers: ['chromium'],
      toggleBrowser: vi.fn(),
    }));

    const wrapper = shallow(
      <ScreenshotListView onClose={onCloseMock} viewPanel="dialog" />,
    );

    const screenshotView = wrapper.find(ScreenshotView);
    expect(screenshotView.first().props().refresh).toBeTruthy();
  });

  it('should show save screenshot title dialog', () => {
    const wrapper = shallow(
      <ScreenshotListView onClose={onCloseMock} viewPanel="dialog" />,
    );
    const toolbar = wrapper.find(Toolbar);

    toolbar.props().onSave?.();

    expect(showModalMock).toHaveBeenCalledTimes(1);
    expect(showModalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        required: true,
        title: 'Screenshots Title',
      }),
    );
  });

  it('should save screenshot', async () => {
    useBrowserStateManager.mockImplementation(() => ({
      activeBrowsers: ['chromium', 'firefox'],
      clearBrowserRefresh: vi.fn(),
      isDisabled: vi.fn(),
      refreshBrowsers: vi.fn(),
      refreshingBrowsers: [],
      toggleBrowser: vi.fn(),
    }));

    const wrapper = shallow(
      <ScreenshotListView
        onClose={onCloseMock}
        viewPanel="dialog"
        showStorybook={false}
      />,
    );
    const toolbar = wrapper.find(Toolbar);

    const screenshotViews = wrapper.find(ScreenshotView);
    screenshotViews.forEach((node) => {
      const browserType = node.props().browserType;
      if (browserType === 'storybook') return;

      node.props().onScreenshotDataChange?.(browserType, {
        base64: `${browserType}-base64`,
        browserOptions: {} as any,
      });
    });

    toolbar.props().onSave?.();

    const showArgs = showModalMock.mock.calls[0][0] as {
      onSave: (value: string) => void;
    };
    showArgs.onSave('title');

    await new Promise((resolve) => setImmediate(resolve));

    expect(saveScreenShotMock).toHaveBeenCalledWith(
      'chromium',
      'title',
      'chromium-base64',
      {},
    );
    expect(saveScreenShotMock).toHaveBeenCalledWith(
      'firefox',
      'title',
      'firefox-base64',
      {},
    );
    expect(saveScreenShotMock).toHaveBeenCalledTimes(2);
  });

  it('should open single screenshot save dialog from ScreenshotView', () => {
    const wrapper = shallow(
      <ScreenshotListView
        onClose={onCloseMock}
        viewPanel="dialog"
        showStorybook={false}
      />,
    );

    const firstView = wrapper.find(ScreenshotView).first();
    firstView.props().onSave?.('chromium');

    expect(showModalMock).toHaveBeenCalledTimes(1);
    expect(showModalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Screenshot Title',
      }),
    );
  });

  it('should show loader while screenshot queue is saving', () => {
    const pending = new Promise<void>(() => {});
    saveScreenShotMock.mockReturnValue(pending);

    const wrapper = shallow(
      <ScreenshotListView
        onClose={onCloseMock}
        viewPanel="dialog"
        showStorybook={false}
      />,
    );

    wrapper
      .find(ScreenshotView)
      .first()
      .props()
      .onScreenshotDataChange?.('chromium', {
        base64: 'chromium-base64',
        browserOptions: {} as any,
      });

    wrapper.find(Toolbar).props().onSave?.();

    const showArgs = showModalMock.mock.calls[0][0] as {
      onSave: (value: string) => void;
    };
    showArgs.onSave('title');
    wrapper.update();

    expect(wrapper.find(Loader).props().open).toBeTruthy();
  });
});
