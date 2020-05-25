import { setBrowserDeviceMock } from '../../../../__manual_mocks__/hooks/use-browser-device';
import { useScreenshotMock } from '../../../../__manual_mocks__/hooks/use-screenshot';
import { ScreenshotView } from '../ScreenshotView';
import { shallow } from 'enzyme';
import React from 'react';
import { ErrorPanel } from '../../common';
import { ScreenShotViewToolbar } from '../ScreenShotViewToolbar';
import { ScreenshotSaveDialog } from '../ScreenshotSaveDialog';

describe('ScreenshotView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(
      <ScreenshotView browserType="chromium" height={200} />,
    );
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('img').type()).toBe('img');
  });

  it('should display error when unable to get screen shot', () => {
    useScreenshotMock.mockImplementationOnce(() => ({
      screenshot: {
        error: 'foo',
      },
    }));
    const wrapper = shallow(
      <ScreenshotView browserType="chromium" height={200} />,
    );
    const errorPanel = wrapper.find(ErrorPanel);
    expect(errorPanel).toHaveLength(1);
  });

  it('should render storybook story in iframe', () => {
    useScreenshotMock.mockImplementationOnce(() => ({
      screenshot: undefined,
    }));
    const wrapper = shallow(
      <ScreenshotView browserType="storybook" height={200} />,
    );

    expect(wrapper.find('iframe')).toHaveLength(1);
  });

  it('should handle refresh', () => {
    const useEffectMock = jest.spyOn(React, 'useEffect');
    let cnt = 0;
    useEffectMock.mockImplementation((f) => {
      cnt = cnt + 1;
      if (cnt > 9) return; // let other hooks call finish
      f();
    });

    const onRefreshEndMock = jest.fn();
    const wrapper = shallow(
      <ScreenshotView
        browserType="storybook"
        height={200}
        refresh={true}
        onRefreshEnd={onRefreshEndMock}
      />,
    );
    wrapper.setProps({ refresh: false });
    expect(onRefreshEndMock).toHaveBeenCalledTimes(1);
  });

  it('should show screenshot description dialog on save and close', () => {
    const wrapper = shallow(
      <ScreenshotView browserType="firefox" height={200} />,
    );
    const toolbar = wrapper.find(ScreenShotViewToolbar);

    expect(toolbar).toHaveLength(1);

    toolbar.props().onSave();

    expect(wrapper.find(ScreenshotSaveDialog).props().open).toBeTruthy();

    wrapper.find(ScreenshotSaveDialog).props().onClose();

    expect(wrapper.find(ScreenshotSaveDialog).props().open).toBeFalsy();
  });

  it('should handle screenshot device selection', () => {
    const wrapper = shallow(
      <ScreenshotView browserType="firefox" height={200} />,
    );
    wrapper.find(ScreenShotViewToolbar).props().onDeviceSelect('foo');
    expect(setBrowserDeviceMock).toHaveBeenCalledTimes(1);
  });
});
