import '../../../../__manual_mocks__/react-useEffect';
import { ScreenshotView } from '../ScreenshotView';
import { shallow } from 'enzyme';
import React from 'react';
import { ErrorPanel, Dialog, InputDialog, Loader } from '../../common';
import { ScreenShotViewToolbar } from '../ScreenShotViewToolbar';
import { useScreenshot } from '../../../hooks/use-screenshot';
import { useSaveScreenshot } from '../../../hooks/use-save-screenshot';
// import { useBrowserOptions } from '../../../hooks/use-browser-options';

jest.mock('../../../hooks/use-save-screenshot');
const useSaveScreenshotMock = useSaveScreenshot as jest.Mock;
const onSaveMock = jest.fn();
onSaveMock.mockImplementation(() => {
  return new Promise((resolve) => {
    resolve();
  });
});

const useSaveScreenshotMockData = () => ({
  ErrorSnackbar: () => null,
  getUpdatingScreenshotTitle: jest.fn(),
  inProgress: false,
  onSuccessClose: jest.fn(),
  result: undefined,
  saveScreenShot: jest.fn(),
});

jest.mock('../../../hooks/use-screenshot.ts');
jest.mock('../../../hooks/use-browser-options.ts');
jest.mock('../../../hooks/use-edit-screenshot.ts');

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
    jest.clearAllMocks();
    useScreenshotMock.mockImplementation(() => ({
      ...useScreenshotMockData(),
    }));
    useSaveScreenshotMock.mockImplementation(() => {
      return {
        ...useSaveScreenshotMockData(),
        saveScreenShot: onSaveMock,
      } as never;
    });
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

  it('should open/close image in full screen', () => {
    const wrapper = shallow(
      <ScreenshotView browserType="firefox" height={200} />,
    );
    wrapper.find(ScreenShotViewToolbar).props().onFullScreen();
    expect(wrapper.find(Dialog).props().open).toBe(true);
  });

  it('should show screenshot options dialog on save and close', () => {
    const wrapper = shallow(
      <ScreenshotView browserType="firefox" height={200} />,
    );
    const toolbar = wrapper.find(ScreenShotViewToolbar);

    expect(toolbar).toHaveLength(1);

    toolbar.props().onSave();

    expect(wrapper.find(InputDialog).props().open).toBeTruthy();

    wrapper.find(InputDialog).props().onClose();

    expect(wrapper.find(InputDialog).props().open).toBeFalsy();
  });

  it('should save screenshot', async () => {
    const wrapper = shallow(
      <ScreenshotView
        browserType="chromium"
        height={200}
        onSaveComplete={jest.fn()}
      />,
    );
    wrapper.find(ScreenShotViewToolbar).props().onSave();

    wrapper.find(InputDialog).props().onSave('title');

    await new Promise((resolve) => setImmediate(resolve));

    expect(onSaveMock).toHaveBeenCalledTimes(1);
  });

  it('should save screenshot when parent request it', async () => {
    const onSaveCompleteMock = jest.fn();

    useSaveScreenshotMock.mockImplementationOnce(() => {
      return {
        ...useSaveScreenshotMockData(),
        inProgress: false,
        saveScreenShot: onSaveMock,
      } as never;
    });

    const wrapper = shallow(
      <ScreenshotView
        browserType="chromium"
        height={200}
        savingWithTitle={'title'}
        onSaveComplete={onSaveCompleteMock}
      />,
    );

    // should not show InputDialog
    expect(wrapper.find(InputDialog).props().open).toBeFalsy();
    // should not show loader
    expect(wrapper.find(Loader).props().open).toBeFalsy();

    useSaveScreenshotMock.mockImplementationOnce(() => {
      return {
        ...useSaveScreenshotMockData(),
        inProgress: true,
        saveScreenShot: onSaveMock,
      } as never;
    });

    wrapper.setProps({ savingWithTitle: 'title-2' });

    expect(onSaveMock).toHaveBeenCalledTimes(1);

    await new Promise((resolve) => setImmediate(resolve));

    expect(onSaveCompleteMock).toHaveBeenCalledTimes(1);
  });

  // it('should set device options', () => {
  //   const setBrowserDeviceOptionsMock = jest.fn();
  //   (useBrowserOptions as jest.Mock).mockImplementationOnce(() => ({
  //     browserOptions: {},
  //     getBrowserOptions: jest.fn(),
  //     setBrowserDeviceOptions: setBrowserDeviceOptionsMock,
  //     setBrowserOptions: jest.fn(),
  //   }));
  //   const wrapper = shallow(
  //     <ScreenshotView browserType="chromium" height={200} />,
  //   );

  //   wrapper.find(ScreenShotViewToolbar).props().onDeviceSelect('iphone');
  //   expect(setBrowserDeviceOptionsMock).toHaveBeenCalledWith(
  //     'chromium',
  //     'iphone',
  //   );
  // });
});
