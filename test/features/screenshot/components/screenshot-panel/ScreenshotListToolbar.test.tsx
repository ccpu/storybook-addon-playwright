import { ScreenshotListToolbar } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotListToolbar';
import { shallow } from 'enzyme';
import React from 'react';
import { ContrastIcon, PhotoIcon, RefreshIcon } from '@storybook/icons';
import {
  DeleteConfirmationButton,
  FixScreenshotFileDialog,
} from '../../../../../src/components/common';

describe('ScreenshotListToolbar', () => {
  const onTestClickMock = vi.fn();
  const onPreviewClickMock = vi.fn();
  const onUpdateClickMock = vi.fn();
  const onDeleteMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(
      <ScreenshotListToolbar
        title={'title'}
        onTestClick={onTestClickMock}
        onPreviewClick={onPreviewClickMock}
        onUpdateClick={onUpdateClickMock}
        onDelete={onDeleteMock}
        hasScreenShot
      />,
    );

    expect(wrapper.exists()).toBeTruthy();
  });

  it('should only render FixScreenshotFileDialog if hasScreenShot=false', () => {
    const wrapper = shallow(
      <ScreenshotListToolbar
        title={'title'}
        onTestClick={onTestClickMock}
        onPreviewClick={onPreviewClickMock}
        onUpdateClick={onUpdateClickMock}
        onDelete={onDeleteMock}
      />,
    );

    expect(wrapper.find(FixScreenshotFileDialog).exists()).toBeTruthy();
    expect(wrapper.find(DeleteConfirmationButton).exists()).toBeFalsy();
  });

  it('should handle callbacks', () => {
    const wrapper = shallow(
      <ScreenshotListToolbar
        title={'title'}
        onTestClick={onTestClickMock}
        onPreviewClick={onPreviewClickMock}
        onUpdateClick={onUpdateClickMock}
        onDelete={onDeleteMock}
        hasScreenShot
      />,
    );

    wrapper.find(RefreshIcon).parent().props().onClick();
    wrapper.find(ContrastIcon).parent().props().onClick();
    wrapper.find(PhotoIcon).parent().props().onClick();
    wrapper.find(DeleteConfirmationButton).props().onDelete();

    expect(onTestClickMock).toHaveBeenCalledTimes(1);
    expect(onPreviewClickMock).toHaveBeenCalledTimes(1);
    expect(onUpdateClickMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });
});
