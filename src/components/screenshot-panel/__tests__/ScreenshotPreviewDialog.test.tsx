import '../../../../__manual_mocks__/react-useEffect';
import { storyData } from '../../../../__test_data__/story-data';
import { ScreenshotPreviewDialog } from '../ScreenshotPreviewDialog';
import { shallow } from 'enzyme';
import { ScreenshotData, StoryData } from '../../../typings';
import React from 'react';
import { ImageDiffPreviewDialog } from '../../common';
import { testScreenshot } from '../../../features/screenshot/screenshot.client';
import { act } from '@testing-library/react-hooks';

jest.mock('../../../features/screenshot/screenshot.client');

describe('ScreenshotPreviewDialog', () => {
  const getScreenshotDate = (): ScreenshotData => {
    return {
      browserType: 'chromium',
      id: 'screenshot-id',
      title: 'title',
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render result', async () => {
    const wrapper = shallow(
      <ScreenshotPreviewDialog
        storyData={storyData as StoryData}
        open={true}
        screenShotData={getScreenshotDate()}
      />,
    );

    await new Promise((resolve) => setImmediate(resolve));

    const imageDiffPreviewDialog = wrapper.find(ImageDiffPreviewDialog);

    expect(testScreenshot).toHaveBeenCalledTimes(1);

    expect(imageDiffPreviewDialog.exists()).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(imageDiffPreviewDialog.props().titleActions()).toBeDefined();
  });

  it('should show handle close', async () => {
    const onCLoseMock = jest.fn();

    const wrapper = shallow(
      <ScreenshotPreviewDialog
        storyData={storyData as StoryData}
        open={true}
        screenShotData={getScreenshotDate()}
        onClose={onCLoseMock}
      />,
    );

    await new Promise((resolve) => setImmediate(resolve));

    const imageDiffPreviewDialog = wrapper.find(ImageDiffPreviewDialog);

    act(() => {
      imageDiffPreviewDialog.props().onClose();
    });

    expect(onCLoseMock).toHaveBeenCalledTimes(1);
  });
});
