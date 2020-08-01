import '../../../../__manual_mocks__/react-useEffect';
import { storyData } from '../../../../__test_data__/story-data';
import { getScreenshotDate } from '../../../../__test_data__/get-screenshot-date';
import { StoryScreenshotPreview } from '../StoryScreenshotPreview';
import { shallow } from 'enzyme';
import React from 'react';
import { useScreenshotUpdate } from '../../../hooks/use-screenshot-update';
import { ScreenshotListPreviewDialog } from '../ScreenshotListPreviewDialog';
import { Snackbar } from '../../common';

jest.mock('../../../hooks/use-screenshot-update');
jest.mock('../../../hooks/use-story-screenshots-diff');
jest.mock('../../../store/screenshot/context');

describe('StoryScreenshotPreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(
      <StoryScreenshotPreview
        screenshotsData={[getScreenshotDate()]}
        storyData={storyData}
        onFinish={jest.fn()}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle update', async () => {
    const updateScreenshotMock = jest.fn();
    (useScreenshotUpdate as jest.Mock).mockImplementationOnce(() => ({
      updateScreenshot: updateScreenshotMock,
    }));

    const wrapper = shallow(
      <StoryScreenshotPreview
        screenshotsData={[getScreenshotDate()]}
        storyData={storyData}
        onFinish={jest.fn()}
        updating
      />,
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
    const updateScreenshotMock = jest.fn();
    (useScreenshotUpdate as jest.Mock).mockImplementationOnce(() => ({
      updateScreenshot: updateScreenshotMock,
    }));

    const wrapper = shallow(
      <StoryScreenshotPreview
        screenshotsData={[getScreenshotDate({ id: 'invalid-id' })]}
        storyData={storyData}
        onFinish={jest.fn()}
        updating
      />,
    );

    const previewDialog = wrapper.find(ScreenshotListPreviewDialog);
    expect(previewDialog.exists()).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const footerActions = previewDialog.props().footerActions().props.children;

    await footerActions[1].props.onClick();

    const errorSnackbar = wrapper.find(Snackbar).last();

    expect(errorSnackbar.props().message).toBe(
      `Unable to find image diff result for 'title' screenshot.`,
    );

    errorSnackbar.props().onClose();

    await new Promise((resolve) => setImmediate(resolve));

    expect(wrapper.find(Snackbar).last().props().message).toBe(undefined);
  });
});
