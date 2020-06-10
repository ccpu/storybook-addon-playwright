import { ScreenshotSave } from '../ScreenshotSave';
import { shallow } from 'enzyme';
import React from 'react';
import { useSaveScreenshot } from '../../../hooks/use-save-screenshot';
import { ImageDiffMessage, InputDialog } from '../../common';

jest.mock('../../../hooks/use-save-screenshot');
const useSaveScreenshotMock = useSaveScreenshot as jest.Mock;

const useSaveScreenshotMockData = () => ({
  ErrorSnackbar: () => null,
  getUpdatingScreenshotTitle: jest.fn(),
  inProgress: false,
  onSuccessClose: jest.fn(),
  result: undefined,
  saveScreenShot: jest.fn(),
});

describe('ScreenshotSave', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ScreenshotSave
        open={true}
        onClose={jest.fn()}
        base64="base64-image"
        browserType="chromium"
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should have ImageDiffMessage', () => {
    const wrapper = shallow(
      <ScreenshotSave
        open={true}
        base64="base64-image"
        browserType="chromium"
        onClose={jest.fn()}
      />,
    );
    expect(wrapper.find(ImageDiffMessage)).toHaveLength(1);
  });

  it('should call for save', () => {
    const onSaveMock = jest.fn();
    useSaveScreenshotMock.mockImplementationOnce(() => {
      return {
        ...useSaveScreenshotMockData(),
        saveScreenShot: onSaveMock,
      } as never;
    });

    const wrapper = shallow(
      <ScreenshotSave
        open={true}
        base64="base64-image"
        browserType="chromium"
        onClose={jest.fn()}
      />,
    );

    wrapper.find(InputDialog).props().onSave('title');

    expect(onSaveMock).toHaveBeenCalledTimes(1);
  });
});
