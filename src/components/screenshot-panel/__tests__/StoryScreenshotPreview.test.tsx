import { useEffectCleanup } from '../../../../__manual_mocks__/react-useEffect';
import { StoryScreenshotPreview } from '../StoryScreenshotPreview';
import { shallow } from 'enzyme';
import React from 'react';
import { useScreenshotUpdate } from '../../../hooks/use-screenshot-update';
import { ScreenshotListPreviewDialog } from '../ScreenshotListPreviewDialog';
import { useStoryScreenshotsDiff } from '../../../hooks/use-story-screenshots-diff';
import { mocked } from 'ts-jest/utils';

import { StoryData, ScreenshotData } from '../../../typings';
import {
  useScreenshotContext,
  useScreenshotDispatch,
} from '../../../store/screenshot/context';

import { useSnackbar } from '../../../hooks/use-snackbar';

jest.mock('../../../hooks/use-snackbar');

const openSnackbarMock = jest.fn();

mocked(useSnackbar).mockImplementation(() => ({
  openSnackbar: openSnackbarMock,
}));

jest.mock('../../../hooks/use-screenshot-update');
jest.mock('../../../hooks/use-story-screenshots-diff');
jest.mock('../../../store/screenshot/context');

mocked(useScreenshotContext).mockImplementation(() => ({
  imageDiffResults: [{ pass: true, screenshotId: 'screenshot-id' }],
  pauseDeleteImageDiffResult: false,
  screenshots: [{ id: 'screenshot-id', title: 'title' }] as ScreenshotData[],
}));

const dispatchMock = jest.fn();
mocked(useScreenshotDispatch).mockImplementation(() => {
  return (...arg) => {
    return dispatchMock(arg);
  };
});

mocked(useStoryScreenshotsDiff).mockImplementationOnce(() => ({
  loaded: true,
  loading: false,
  storyData: {} as StoryData,
}));

describe('StoryScreenshotPreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(
      <StoryScreenshotPreview target="all" onClose={jest.fn()} />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should pause and unpause removing image diff result', () => {
    shallow(
      <StoryScreenshotPreview target="all" onClose={jest.fn()} updating />,
    );

    useEffectCleanup();

    expect(dispatchMock).toHaveBeenCalledWith([
      { state: true, type: 'pauseDeleteImageDiffResult' },
    ]);
    expect(dispatchMock).toHaveBeenCalledWith([
      { state: false, type: 'pauseDeleteImageDiffResult' },
    ]);
    expect(dispatchMock).toHaveBeenCalledWith([
      { type: 'removePassedImageDiffResult' },
    ]);
  });

  it('should handle update', async () => {
    const updateScreenshotMock = jest.fn();
    (useScreenshotUpdate as jest.Mock).mockImplementationOnce(() => ({
      updateScreenshot: updateScreenshotMock,
    }));

    const wrapper = shallow(
      <StoryScreenshotPreview target="all" onClose={jest.fn()} updating />,
    );

    const previewDialog = wrapper.find(ScreenshotListPreviewDialog);
    expect(previewDialog.exists()).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const footerActions = previewDialog.props().footerActions().props.children;

    await footerActions[1].props.onClick();

    expect(updateScreenshotMock).toHaveBeenCalledWith({
      pass: true,
      screenshotId: 'screenshot-id',
    });
  });

  it('should throw if imageDiffResult not found while updating', async () => {
    mocked(useScreenshotContext).mockImplementation(() => ({
      imageDiffResults: [{ pass: true, screenshotId: 'screenshot-id-2' }],
      pauseDeleteImageDiffResult: false,
      screenshots: [
        { id: 'screenshot-id', title: 'title' },
      ] as ScreenshotData[],
    }));

    const wrapper = shallow(
      <StoryScreenshotPreview target="all" onClose={jest.fn()} updating />,
    );

    const previewDialog = wrapper.find(ScreenshotListPreviewDialog);
    expect(previewDialog.exists()).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const footerActions = previewDialog.props().footerActions().props.children;

    await footerActions[1].props.onClick();

    expect(openSnackbarMock.mock.calls[0][0]).toBe(
      `Unable to find image diff result for 'title' screenshot.`,
    );
  });
});
