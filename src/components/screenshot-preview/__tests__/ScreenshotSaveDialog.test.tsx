import { ScreenshotSaveDialog } from '../ScreenshotSaveDialog';
import { shallow } from 'enzyme';
import React from 'react';
import { useSaveScreenshot } from '../../../hooks/use-save-screenshot';
import { Snackbar, ImageDiffMessage, InputDialog } from '../../common';

jest.mock('../../../hooks/use-save-screenshot');
const useSaveScreenshotMock = useSaveScreenshot as jest.Mock;

describe('ScreenshotSaveDialog', () => {
  const useSaveScreenshotMockData = () => ({
    ErrorSnackbar: () => null,
    getUpdatingScreenshotTitle: jest.fn(),
    inProgress: false,
    onSuccessClose: jest.fn(),
    result: undefined,
    saveScreenShot: jest.fn(),
  });

  it('should have ImageDiffMessage ', () => {
    const wrapper = shallow(
      <ScreenshotSaveDialog
        open={true}
        base64="base64-image"
        browserType="chromium"
        onClose={jest.fn()}
      />,
    );
    expect(wrapper.find(ImageDiffMessage)).toHaveLength(1);
  });

  it('should show success message for added screenshot', () => {
    useSaveScreenshotMock.mockImplementationOnce(() => {
      return {
        ...useSaveScreenshotMockData(),
        result: {
          added: true,
        },
      } as never;
    });

    const wrapper = shallow(
      <ScreenshotSaveDialog
        open={true}
        base64="base64-image"
        browserType="chromium"
        onClose={jest.fn()}
      />,
    );
    expect(wrapper.find(Snackbar).props().message).toBe(
      'Screenshot saved successfully.',
    );
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
      <ScreenshotSaveDialog
        open={true}
        base64="base64-image"
        browserType="chromium"
        onClose={jest.fn()}
      />,
    );

    wrapper.find(InputDialog).props().onSave('desc');

    expect(onSaveMock).toHaveBeenCalledTimes(1);
  });
});
