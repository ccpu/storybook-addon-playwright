import { ScreenshotSaveDialog } from '../ScreenshotSaveDialog';
import { shallow } from 'enzyme';
import React from 'react';
import * as hook from '../../../hooks/use-save-screenshot';
import { Snackbar, InputDialog } from '../../common';

jest.mock('../../../hooks/use-save-screenshot');
const mockedCounterHook = hook as jest.Mocked<typeof hook>;

describe('ScreenshotSaveDialog', () => {
  it('should show error', () => {
    mockedCounterHook.useSaveScreenshot.mockImplementationOnce(() => {
      return {
        error: 'foo',
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
    expect(wrapper.find(Snackbar).props().message).toBe('foo');
  });

  it('should show screenshot diff pass message', () => {
    mockedCounterHook.useSaveScreenshot.mockImplementationOnce(() => {
      return {
        result: {
          oldScreenShotTitle: 'foo',
          pass: true,
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
    expect(wrapper.find(Snackbar).text()).toBe(
      'Title: fooScreenshot with the same setting found, no change has been detected.',
    );
  });

  it('should show success message for added screenshot', () => {
    mockedCounterHook.useSaveScreenshot.mockImplementationOnce(() => {
      return {
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
    mockedCounterHook.useSaveScreenshot.mockImplementationOnce(() => {
      return {
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
