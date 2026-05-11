import { useActiveBrowserMock } from '../../../../manual-mocks/hooks/use-active-browser';
import { ScreenshotListView } from '../../../../../src/features/screenshot/components/screenshot-preview/ScreenshotListView';
import { shallow } from 'enzyme';
import React from 'react';
import { ScreenshotView } from '../../../../../src/features/screenshot/components/screenshot-preview/ScreenshotView';
import { Toolbar } from '../../../../../src/features/screenshot/components/screenshot-preview/Toolbar';
import { InputDialog, Loader } from '../../../../../src/components/common';

describe('ScreenshotList', () => {
  const onCloseMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(
      <ScreenshotListView onClose={onCloseMock} viewPanel="dialog" />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should not have screenshot view if there is no active browser', () => {
    useActiveBrowserMock.mockImplementationOnce(() => ({
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

    useActiveBrowserMock.mockImplementationOnce(() => ({
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
    useActiveBrowserMock.mockImplementationOnce(() => ({
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

    expect(wrapper.find(InputDialog).props().open).toBeTruthy();
  });

  it('should save screenshot', () => {
    useActiveBrowserMock.mockImplementation(() => ({
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

    toolbar.props().onSave?.();

    wrapper.find(InputDialog).props().onSave('title');

    const chromium = wrapper.find(ScreenshotView).first();

    expect(chromium.props().savingWithTitle).toBe('title');

    chromium.props().onSaveComplete?.('chromium');

    expect(wrapper.find(ScreenshotView).first().props().savingWithTitle).toBe(undefined);

    // Loader should be visible until all screenshot processed
    expect(wrapper.find(Loader).props().open).toBeTruthy();

    const firefox = wrapper.find(ScreenshotView).last();
    expect(firefox.props().savingWithTitle).toBe('title');

    firefox.props().onSaveComplete?.('firefox');

    expect(wrapper.find(ScreenshotView).last().props().savingWithTitle).toBe(undefined);

    expect(wrapper.find(Loader).props().open).toBeFalsy();
  });
});
