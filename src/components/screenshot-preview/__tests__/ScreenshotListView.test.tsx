import { useActiveBrowserMock } from '../../../../__manual_mocks__/hooks/use-active-browser';
import { ScreenshotListView } from '../ScreenshotListView';
import { shallow } from 'enzyme';
import React from 'react';
import { ScreenshotView } from '../ScreenshotView';
import { Toolbar } from '../Toolbar';
import { InputDialog, Loader } from '../../common';

describe('ScreenshotList', () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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
      isDisabled: jest.fn(),
      toggleBrowser: jest.fn(),
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
    const wrapper = shallow(
      <ScreenshotListView onClose={onCloseMock} viewPanel="dialog" />,
    );
    const toolbar = wrapper.find(Toolbar);

    toolbar.props().onRefresh();

    let screenshotView = wrapper.find(ScreenshotView);
    expect(screenshotView.first().props().refresh).toBeTruthy();

    screenshotView.first().props().onRefreshEnd();
    screenshotView = wrapper.find(ScreenshotView);
    expect(screenshotView.first().props().refresh).toBeFalsy();
  });

  it('should show save screenshot title dialog ', () => {
    const wrapper = shallow(
      <ScreenshotListView onClose={onCloseMock} viewPanel="dialog" />,
    );
    const toolbar = wrapper.find(Toolbar);

    toolbar.props().onSave();

    expect(wrapper.find(InputDialog).props().open).toBeTruthy();
  });

  it('should save screenshot', () => {
    useActiveBrowserMock.mockImplementation(() => ({
      activeBrowsers: ['chromium', 'firefox'],
      isDisabled: jest.fn(),
      toggleBrowser: jest.fn(),
    }));

    const wrapper = shallow(
      <ScreenshotListView
        onClose={onCloseMock}
        viewPanel="dialog"
        showStorybook={false}
      />,
    );
    const toolbar = wrapper.find(Toolbar);

    toolbar.props().onSave();

    wrapper.find(InputDialog).props().onSave('title');

    const chromium = wrapper.find(ScreenshotView).first();

    expect(chromium.props().savingWithTitle).toBe('title');

    chromium.props().onSaveComplete('chromium');

    expect(wrapper.find(ScreenshotView).first().props().savingWithTitle).toBe(
      undefined,
    );

    // Loader should be visible until all screenshot processed
    expect(wrapper.find(Loader).props().open).toBeTruthy();

    const firefox = wrapper.find(ScreenshotView).last();
    expect(firefox.props().savingWithTitle).toBe('title');

    firefox.props().onSaveComplete('firefox');

    expect(wrapper.find(ScreenshotView).last().props().savingWithTitle).toBe(
      undefined,
    );

    expect(wrapper.find(Loader).props().open).toBeFalsy();
  });
});
