import '../../../../__manual_mocks__/react-useEffect';
// import { setBrowserDeviceMock } from '../../../../__manual_mocks__/hooks/use-browser-device';
import { ScreenshotView } from '../ScreenshotView';
import { shallow } from 'enzyme';
import React from 'react';
import { ErrorPanel, Dialog } from '../../common';
import { ScreenShotViewToolbar } from '../ScreenShotViewToolbar';
import { ScreenshotSaveDialog } from '../ScreenshotSaveDialog';
import { useScreenshot } from '../../../hooks/use-screenshot';
import { useBrowserDevice } from '../../../hooks/use-browser-device';

jest.mock('../../../hooks/use-screenshot.ts');
jest.mock('../../../hooks/use-browser-device.ts');

const useScreenshotMock = useScreenshot as jest.Mock;

describe('ScreenshotView', () => {
  const useScreenshotMockData = () => ({
    getSnapshot: jest.fn(),
    loading: false,
    screenshot: {
      base64: 'base64-image',
      error: undefined,
    },
  });

  beforeEach(() => {
    useScreenshotMock.mockImplementation(() => ({
      ...useScreenshotMockData(),
    }));
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
    useScreenshotMock.mockImplementation(() => ({
      ...useScreenshotMockData(),
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
    useScreenshotMock.mockImplementation(() => ({
      ...useScreenshotMockData(),
      screenshot: undefined,
    }));
    const wrapper = shallow(
      <ScreenshotView browserType="storybook" height={200} />,
    );

    expect(wrapper.find('iframe')).toHaveLength(1);
  });

  it('should handle refresh', () => {
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
    const setBrowserDeviceMockMock = jest.fn();
    (useBrowserDevice as jest.Mock).mockImplementation(() => ({
      browserDevice: {},
      setBrowserDevice: setBrowserDeviceMockMock,
    }));
    const wrapper = shallow(
      <ScreenshotView browserType="firefox" height={200} />,
    );
    wrapper.find(ScreenShotViewToolbar).props().onDeviceSelect('foo');
    expect(setBrowserDeviceMockMock).toHaveBeenCalledTimes(1);
  });

  it('should open/close image in full screen', () => {
    const wrapper = shallow(
      <ScreenshotView browserType="firefox" height={200} />,
    );
    wrapper.find(ScreenShotViewToolbar).props().onFullScreen();
    expect(wrapper.find(Dialog).props().open).toBe(true);
  });
});
